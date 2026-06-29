#!/usr/bin/env python3
"""
Lab 01: Python Fundamentals
============================================================
Topics: variables, loops, functions, error handling
Run:    python3 lab_01_python.py
"""

print("=" * 55)
print("  Lab 01 — Python Fundamentals")
print("=" * 55)


# ── Exercise 1: Variables & Data Types ─────────────────────
# Fill in your own values below.

your_name = "Your Name Here"  # str
your_age = 0                  # int
gpa = 0.0                     # float
is_student = True             # bool

print(f"\n[1] Name: {your_name} | Age: {your_age} | GPA: {gpa} | Student: {is_student}")


# ── Exercise 2: List Operations ────────────────────────────
numbers = [5, 2, 8, 1, 9, 3, 7, 4, 6]

# TODO: sort the list ascending and assign to sorted_numbers
sorted_numbers = None

# TODO: compute the average and assign to average (float, 2 decimal places)
average = None

print(f"\n[2] Sorted : {sorted_numbers}")
print(f"    Average: {average}")


# ── Exercise 3: Functions ──────────────────────────────────
def calculate_grade(score: float) -> str:
    """
    Return the letter grade for a given score (0–100).
    A >= 80 | B >= 70 | C >= 60 | D >= 50 | F < 50
    """
    # TODO: implement
    pass


test_scores = [95, 82, 71, 64, 53, 40]
print("\n[3] Grade results:")
for s in test_scores:
    print(f"    {s:3d} → {calculate_grade(s)}")


# ── Exercise 4: String Manipulation ───────────────────────
sentence = "the quick brown fox jumps over the lazy dog"

# TODO: capitalise every word and assign to title_sentence
title_sentence = None

# TODO: count how many words start with the letter 't'
t_count = None

print(f"\n[4] Title  : {title_sentence}")
print(f"    Words starting with 't': {t_count}")


# ── Exercise 5: Error Handling ─────────────────────────────
def safe_divide(a: float, b: float) -> float | str:
    """
    Divide a by b. Return the result, or the string
    'Cannot divide by zero' if b == 0. Use try/except.
    """
    # TODO: implement
    pass


print(f"\n[5] 10 / 2 = {safe_divide(10, 2)}")
print(f"    10 / 0 = {safe_divide(10, 0)}")

print("\n✅  Finished! Replace all None values to complete the lab.")
