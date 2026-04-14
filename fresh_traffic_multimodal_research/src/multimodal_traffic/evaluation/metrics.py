from __future__ import annotations

from typing import Dict, Iterable

import numpy as np
from sklearn.metrics import accuracy_score, f1_score


def classification_metrics(y_true: Iterable[str], y_pred: Iterable[str]) -> Dict[str, float]:
    y_true = list(y_true)
    y_pred = list(y_pred)
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "f1_macro": float(f1_score(y_true, y_pred, average="macro")),
        "f1_weighted": float(f1_score(y_true, y_pred, average="weighted")),
    }


def summarize_control_metrics(wait_times: Iterable[float], throughputs: Iterable[float]) -> Dict[str, float]:
    wait_times = np.asarray(list(wait_times), dtype=float)
    throughputs = np.asarray(list(throughputs), dtype=float)
    return {
        "avg_wait_sec": float(wait_times.mean()) if wait_times.size else 0.0,
        "p95_wait_sec": float(np.percentile(wait_times, 95)) if wait_times.size else 0.0,
        "avg_throughput": float(throughputs.mean()) if throughputs.size else 0.0,
    }
