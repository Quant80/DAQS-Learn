#!/usr/bin/env python3
"""
Lab 02: Data Analysis with Pandas
============================================================
Topics: DataFrame creation, filtering, grouping, statistics
Run:    python3 lab_02_pandas.py
"""
import pandas as pd
import numpy as np

print("=" * 55)
print("  Lab 02 — Data Analysis with Pandas")
print("=" * 55)

# ── Setup ──────────────────────────────────────────────────
data = {
    "student": ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "math":    [85, 72, 91, 68, 95, 78],
    "science": [78, 85, 88, 74, 92, 65],
    "english": [92, 68, 79, 85, 88, 71],
}
df = pd.DataFrame(data)
print("\nRaw data:")
print(df.to_string(index=False))


# ── Exercise 1: Average score per student ──────────────────
# Add a new column 'average' with the mean of math, science, english.
# Hint: df[["math","science","english"]].mean(axis=1)

df["average"] = None  # TODO

print("\n[1] Students with averages:")
print(df[["student", "average"]].to_string(index=False))


# ── Exercise 2: Top student ────────────────────────────────
# Find the name of the student with the highest average.

top_student = None  # TODO

print(f"\n[2] Top student: {top_student}")


# ── Exercise 3: Best subject ───────────────────────────────
# Which of math, science, english has the highest class mean?

subject_means = None  # TODO: Series of means for the 3 subjects
best_subject  = None  # TODO: name (str) of the subject with highest mean

print(f"\n[3] Subject means:\n{subject_means}")
print(f"    Best subject: {best_subject}")


# ── Exercise 4: Students needing support ───────────────────
# Filter rows where average < 70.

needs_support = None  # TODO

print("\n[4] Students needing support (avg < 70):")
print(needs_support)


# ── Exercise 5: Rank students ──────────────────────────────
# Add a 'rank' column (1 = highest average). Use .rank(ascending=False).

df["rank"] = None  # TODO

print("\n[5] Final rankings:")
print(df[["student", "average", "rank"]].sort_values("rank").to_string(index=False))

print("\n✅  Finished! Replace all None values to complete the lab.")
