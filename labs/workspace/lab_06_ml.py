#!/usr/bin/env python3
"""
Lab 06: Machine Learning Introduction
============================================================
Topics: train/test split, decision tree, evaluation metrics
Run:    python3 lab_06_ml.py
"""
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
)

print("=" * 55)
print("  Lab 06 — Machine Learning Introduction")
print("=" * 55)


# ── Exercise 1: Load & explore the dataset ─────────────────
iris = load_iris()
X = iris.data    # features: sepal/petal length & width
y = iris.target  # labels: 0=setosa, 1=versicolor, 2=virginica

print(f"\n[1] Dataset shape : X={X.shape}, y={y.shape}")
print(f"    Feature names : {iris.feature_names}")
print(f"    Target classes: {list(iris.target_names)}")

# TODO: Convert X and y to a pandas DataFrame and print the first 5 rows.
df = None
# print(df.head())


# ── Exercise 2: Split the data ─────────────────────────────
# Split into 80% train, 20% test. Use random_state=42 for reproducibility.

X_train = X_test = y_train = y_test = None  # TODO

print(f"\n[2] Train size: {len(X_train) if X_train is not None else 'N/A'}")
print(f"    Test size : {len(X_test)  if X_test  is not None else 'N/A'}")


# ── Exercise 3: Train a Decision Tree ─────────────────────
# Create a DecisionTreeClassifier(max_depth=3, random_state=42)
# and fit it on the training data.

model = None  # TODO

print(f"\n[3] Model trained: {model}")


# ── Exercise 4: Evaluate the model ────────────────────────
# Predict on X_test and compute accuracy_score.

y_pred = None   # TODO
accuracy = None # TODO

print(f"\n[4] Accuracy: {accuracy:.2%}" if accuracy is not None else "\n[4] Accuracy: N/A")

if y_pred is not None:
    print("\n    Classification Report:")
    print(classification_report(y_test, y_pred, target_names=iris.target_names))
    print("    Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))


# ── Exercise 5: Make predictions on new samples ────────────
new_samples = np.array([
    [5.1, 3.5, 1.4, 0.2],   # likely setosa
    [6.7, 3.0, 5.2, 2.3],   # likely virginica
    [5.9, 3.0, 4.2, 1.5],   # likely versicolor
])

# TODO: use model.predict(new_samples) and map to class names
predictions = None

print("\n[5] Predictions for new samples:")
if predictions is not None:
    for sample, pred in zip(new_samples, predictions):
        print(f"    {sample} → {iris.target_names[pred]}")

print("\n✅  Finished! Replace all None values to complete the lab.")
