#!/usr/bin/env python3
"""
Lab 04: Sorting Algorithms
============================================================
Topics: bubble sort, merge sort, quicksort, Big-O analysis
Run:    python3 lab_04_sorting.py
"""
import time
import random

print("=" * 55)
print("  Lab 04 — Sorting Algorithms")
print("=" * 55)


# ── Exercise 1: Bubble Sort ────────────────────────────────
def bubble_sort(arr: list[int]) -> list[int]:
    """
    Sort arr using bubble sort (O(n²)).
    Do NOT use Python's built-in sort.
    Return the sorted list.
    """
    arr = arr.copy()
    # TODO: implement
    return arr


# ── Exercise 2: Merge Sort ─────────────────────────────────
def merge_sort(arr: list[int]) -> list[int]:
    """
    Sort arr using merge sort (O(n log n)).
    Return the sorted list.
    """
    if len(arr) <= 1:
        return arr
    # TODO: split, recurse, merge
    return arr


# ── Exercise 3: Quicksort ──────────────────────────────────
def quicksort(arr: list[int]) -> list[int]:
    """
    Sort arr using quicksort (avg O(n log n)).
    Use the last element as pivot.
    Return the sorted list.
    """
    if len(arr) <= 1:
        return arr
    # TODO: partition around pivot, recurse
    return arr


# ── Exercise 4: Benchmark ──────────────────────────────────
def benchmark(sort_fn, data: list[int]) -> float:
    """Return elapsed seconds for sort_fn on a copy of data."""
    arr = data.copy()
    start = time.perf_counter()
    sort_fn(arr)
    return time.perf_counter() - start


sizes = [100, 500, 1000]
print("\n[Benchmark] Time in milliseconds (lower is better):")
print(f"{'Size':>6} | {'Bubble':>10} | {'Merge':>10} | {'Quick':>10} | {'Python':>10}")
print("-" * 55)

for n in sizes:
    data = [random.randint(0, 10_000) for _ in range(n)]
    t_bubble = benchmark(bubble_sort, data) * 1000
    t_merge  = benchmark(merge_sort,  data) * 1000
    t_quick  = benchmark(quicksort,   data) * 1000
    t_python = benchmark(sorted,      data) * 1000
    print(f"{n:>6} | {t_bubble:>9.2f}ms | {t_merge:>9.2f}ms | {t_quick:>9.2f}ms | {t_python:>9.2f}ms")

# ── Exercise 5: Correctness check ─────────────────────────
test = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
expected = sorted(test)
print(f"\n[Correctness]")
print(f"  bubble_sort : {'✅' if bubble_sort(test) == expected else '❌ Not working yet'}")
print(f"  merge_sort  : {'✅' if merge_sort(test)  == expected else '❌ Not working yet'}")
print(f"  quicksort   : {'✅' if quicksort(test)   == expected else '❌ Not working yet'}")

print("\n✅  Finished! Implement the three sort functions above.")
