<div align="center">

#  AI Cricket Commentary Generator

**Turning raw cricket footage into real-time, emotion-rich commentary — automatically.**

*A multimodal AI pipeline that watches a cricket clip, understands the shot and outcome, and narrates it like a real commentator.*

[![Model](https://img.shields.io/badge/Model-Qwen2.5--VL--7B-blue)](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct)
[![Fine--tuned](https://img.shields.io/badge/Fine--tuned-LoRA%20%2B%20HQQ%204--bit-orange)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12-yellow)]()

[Demo](#-demo) • [Architecture](#-architecture) • [Results](#-results) • [Setup](#-setup) • [Usage](#-usage)

</div>

---

##  Overview

Existing cricket highlight tools stop at classification — "this was a six." This project goes further: given a short clip, it **perceives** the action (who's batting, what shot was played, what the outcome was), **reasons** over that perception with commentary-appropriate context (score, momentum, shot difficulty), and **generates spoken commentary** that sounds like it came from a real broadcast — synced back onto the original video.

Rather than using one model for the entire task, the system divides the process into multiple stages. Each stage focuses on a specific task, making the pipeline more reliable, easier to debug, and simpler to extend.

> **Input:** a 5–8 second cricket clip
> **Output:** a video with synced, emotionally expressive AI commentary — shot identified, outcome called, score context included

---

## 🎬 Demo

<!-- Replace with your actual sample video / GIF -->
| Input Clip | Generated Commentary | Output |
|---|---|---|
| `sample_clips/reverse_sweep.mp4` | *"He goes down and around — reverse sweep, and that's FOUR! Brilliant improvisation from the batsman."* | `outputs/reverse_sweep_commentary.mp4` |

🎥 **[Watch the full demo video](#)** &nbsp;•&nbsp; 📝 **[See more sample outputs](sample_outputs/)**

### Frontend

<!-- Replace with your actual screenshot -->
![Frontend Screenshot](assets/frontend_screenshot.png)

*Upload a clip, get AI-generated commentary with synced audio — all through a clean web interface.*

---

## 🧠 Architecture

The pipeline breaks the problem into three independent, purpose-built stages rather than one end-to-end black box — each stage is easier to train, debug, and improve in isolation.

```
┌──────────────┐     ┌───────────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Raw Video   │ ──▶ │   Perception Model     │ ──▶ │  Commentary LLM   │ ──▶ │  TTS + Sync │
│  (5–8s clip) │     │  Qwen2.5-VL-7B (LoRA)  │     │  (fine-tuned LLM) │     │             │
└──────────────┘     └───────────────────────┘     └──────────────────┘     └─────────────┘
                       • Shot classification         • Structured facts        • Expressive
                       • Outcome classification         → natural commentary     speech synthesis
                       • 11 shot types, 3 outcomes    • Emotion-aware tone      • Duration-matched
                                                                                  to clip length
```

### 1️⃣ Perception — `Qwen2.5-VL-7B-Instruct` (fine-tuned)
- Multi-task video understanding: **shot classification** (11 classes: cover drive, pull, reverse sweep, sweep, hook, flick, square cut, late cut, straight drive, defense, lofted) and **outcome classification** (four / six / bowled).
- Fine-tuned with **LoRA** (rank 16, attention-only, vision tower frozen) on top of **HQQ 4-bit quantization** — full-precision-quality understanding at a fraction of the memory footprint.
- Trained on ~2,600 hand-collected and labeled cricket clips across both tasks, with class-balanced weighted sampling to handle uneven category sizes.

### 2️⃣ Commentary Generation — Fine-tuned LLM
- Takes structured perception output (shot type, outcome, score context) and generates **natural, emotionally expressive commentary text** — excited for boundaries, tense for wickets, measured for defensive shots.
- Decouples *what happened* (perception) from *how it's said* (generation) — each model only has to be good at one thing.

### 3️⃣ Speech + Sync
- Converts generated commentary to expressive speech via TTS.
- Aligns audio duration to the original clip length so the narration lands naturally on the action, not after it.

---

## 🔄 Approach & Iterations

This pipeline went through two real architecture changes before landing on the current setup — documenting them here because the *reasons* for switching are as informative as the final choice.

### Attempt 1: LLaVA-NeXT-Video-7B + VideoMAE
The first version of the perception stage combined two approaches: a fine-tuned **LLaVA-NeXT-Video-7B-32K** for frame-level shot recognition, and a separate **VideoMAE** classifier trained from scratch on the labeled clips.

**Why it didn't work well:**
- The LLaVA-NeXT-Video pipeline processed clips by sampling a rolling window of frames but classifying based on a **single central frame per window** — meaning the model never actually saw motion. A cricket shot is defined by the swing, contact, and follow-through, not any one static frame, so this threw away exactly the information needed to tell shots apart.
- **VideoMAE**, trained from scratch, needed far more data and training time to learn useful video features than the dataset size (~2,600 clips) could support — it's designed for training on large-scale action-recognition corpora, not fine-tuning on a modest custom dataset. Results were close to random on several shot classes.
- Neither approach gave a clean way to jointly handle two related-but-separate tasks (shot type *and* outcome) from clips that were only labeled for one or the other.

### Attempt 2 (current): Qwen2.5-VL-7B-Instruct
Switched to **Qwen2.5-VL** as the perception backbone, fine-tuned with LoRA. Reasons this was a better fit for this specific problem:

- **Native multi-frame/video input**, not single-frame classification — Qwen2.5-VL accepts a full sequence of sampled frames per inference call, so the model can actually perceive motion across a swing instead of guessing from a freeze-frame.
- **Absolute time encoding** for video — built to localize *when* something happens within a clip, which matters directly for a task like bowled-out clips where the ball, the shot attempt, and the wicket happen in a specific temporal sequence within one short video.
- **Strong LoRA fine-tuning precedent at small dataset scale** — unlike training a video backbone from scratch (VideoMAE), Qwen2.5-VL already has broad visual and world knowledge from pretraining; fine-tuning only needs to teach it the task-specific vocabulary and visual patterns, which is a far more data-efficient learning problem for a ~2,600-clip dataset.
- **One backbone, two tasks** — a single fine-tuned model handles both shot classification and outcome classification via task-specific prompts, trained on the disjoint-labeled datasets mixed into one training set, rather than needing two separately-trained models.

This iteration — and the debugging that came with it (overfitting from too-fast convergence, evaluation metric bugs from unfiltered model output, dataset path/integrity issues during migration between training platforms) — is reflected in the training notebooks under [`notebooks/`](notebooks/).

---

## 📊 Results

<!-- Fill in with your actual final numbers once training is complete -->

| Task | Accuracy | Macro-F1 | MCC |
|---|---|---|---|
| Shot Classification (11-way) | `XX%` | `X.XX` | `X.XX` |
| Outcome Classification (3-way) | `XX%` | `X.XX` | `X.XX` |

<div align="center">
<img src="charts/training_curves.png" width="45%">
<img src="charts/confmat_shot_test.png" width="45%">
</div>

Full evaluation artifacts — per-class F1, confusion matrices, training/validation curves, and dataset class distribution — are in [`charts/`](charts/) and on the [model card](https://huggingface.co/may-ur08/qwen2.5-vl-gen-cricket-commentary).

**Why macro-F1 and MCC, not just accuracy?** The dataset has meaningful class imbalance (122–292 clips per shot class). Macro-F1 and Matthews Correlation Coefficient weight every class equally, so the reported score reflects real per-class performance rather than being dominated by the most common categories. Model selection during training used the **minimum** of the two task F1 scores, not their average — ensuring the checkpoint saved is one where *both* tasks work, not one where a strong shot-classifier is masking a weak outcome-classifier.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Vision-Language Model | Qwen2.5-VL-7B-Instruct |
| Fine-tuning | LoRA (PEFT) + HQQ 4-bit quantization |
| Training Infra | Lightning AI (H100) |
| Video Processing | `qwen-vl-utils`, `decord` |
| Commentary LLM | Fine-tuned LoRA adapter |
| TTS | *(fill in — e.g. Kyutai TTS / Moshi)* |
| Backend | *(fill in your stack)* |
| Frontend | *(fill in your stack)* |
| Experiment Tracking / Metrics | scikit-learn, matplotlib, seaborn |
| Model Hosting | Hugging Face Hub |

---

## 📂 Dataset

| Task | Classes | Clips |
|---|---|---|
| Shot Type | 11 (cover, pull, reverse sweep, sweep, hook, flick, square cut, late cut, straight, defense, lofted) | ~1,922 |
| Outcome | 3 (four, six, bowled) | ~712 |

- Clips are 5–8 seconds, hand-curated and labeled from real match footage.
- Split stratified per class: standard classes use 80/10/10 train/val/test; classes with fewer than 160 clips use a fixed 15/15 val/test allocation to guarantee meaningful evaluation on rarer categories (e.g. reverse sweep, bowled).
- Full dataset hosted as a private Hugging Face dataset repo; manifest generation and split logic in [`notebooks/build_manifest.ipynb`](notebooks/).

---

## ⚙️ Setup

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

pip install -r requirements.txt
```

### Environment variables
```bash
export HF_TOKEN=your_huggingface_token
```

### Run inference
```bash
python inference.py --video path/to/clip.mp4 --output output/commentary.mp4
```

### Fine-tune on your own data
```bash
# See notebooks/training.ipynb for the full fine-tuning pipeline:
# manifest generation → LoRA + HQQ setup → training → evaluation → HF Hub push
jupyter notebook notebooks/training.ipynb
```

---

## 🚀 Usage

```python
from inference import CricketCommentaryPipeline

pipeline = CricketCommentaryPipeline(model_repo="may-ur08/qwen2.5-vl-gen-cricket-commentary")

result = pipeline.generate(video_path="sample_clips/reverse_sweep.mp4")

print(result.shot)         # "reverse sweep"
print(result.outcome)      # "four"
print(result.commentary)   # "He goes down and around — reverse sweep, and that's FOUR!"

result.save("output/commentary.mp4")  # video with synced audio commentary
```

---

## 📁 Project Structure

```
.
├── notebooks/
│   ├── build_manifest.ipynb       # dataset scanning, splitting, manifest generation
│   ├── training.ipynb             # LoRA + HQQ fine-tuning pipeline
│   └── evaluation.ipynb           # metrics, confusion matrices, charts
├── backend/                       # inference + API server
├── frontend/                      # web interface
├── sample_clips/                  # example input videos
├── sample_outputs/                # example generated commentary (text + video)
├── charts/                        # training curves, confusion matrices, per-class F1
├── assets/                        # screenshots, demo GIFs
└── README.md
```

---

## 🎯 Key Engineering Decisions

- **Multi-task learning over separate models** — shot and outcome classification share one fine-tuned backbone, trained on disjoint-labeled data via task-specific prompts mixed into a single training set, rather than requiring both labels on every clip.
- **HQQ over bitsandbytes/GPTQ/AWQ for quantization** — no calibration dataset required (unlike GPTQ/AWQ), faster to quantize, and PEFT-compatible out of the box.
- **min(task F1) as the checkpoint-selection criterion**, not averaged F1 — prevents a strong task from masking a collapsed one when picking the "best" model.
- **Weighted sampling over data duplication** for class imbalance — rebalances training signal across the 11 shot classes and between the shot/outcome tasks without creating duplicate video files on disk.
- **Frozen vision tower, LoRA on attention only** — matches the official Qwen2-VL fine-tuning recipe, keeps the pretrained visual grounding intact while adapting the language head to the task vocabulary.

---

## 🔭 Future Work

- [ ] Constrained decoding over the fixed label vocabulary (vs. free-form generation) to eliminate residual formatting artifacts in predictions
- [ ] Player identification via jersey number OCR / roster matching
- [ ] Live scoreboard OCR integration for real-time score context
- [ ] Expand shot vocabulary and add bowling-style classification
- [ ] Real-time streaming inference for live match commentary

---

## 🙏 Acknowledgments

- [Qwen2.5-VL](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct) — Alibaba's vision-language model, used as the perception backbone.
- [HQQ](https://github.com/mobiusml/hqq) — calibration-free quantization.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built by [Mayur Soni](https://github.com/MayurSoni08)**

[LinkedIn](#) • [Portfolio](#) • [Email](#)

</div>
