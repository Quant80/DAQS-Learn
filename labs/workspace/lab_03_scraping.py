#!/usr/bin/env python3
"""
Lab 03: Web Scraping with Requests
============================================================
Topics: HTTP requests, JSON APIs, data extraction, CSV export
Run:    python3 lab_03_scraping.py

NOTE: This lab uses a free public API (no key required).
      You need internet access inside the container.
"""
import requests
import json
import csv

print("=" * 55)
print("  Lab 03 — Web Scraping with Requests")
print("=" * 55)

BASE_URL = "https://jsonplaceholder.typicode.com"


# ── Exercise 1: Fetch all users ────────────────────────────
# GET /users and print the number of users returned.

response = None  # TODO: requests.get(f"{BASE_URL}/users")
users    = None  # TODO: parse JSON from response

print(f"\n[1] Total users fetched: {users}")  # should be 10


# ── Exercise 2: Extract names and emails ───────────────────
# Build a list of dicts: [{"name": ..., "email": ...}, ...]

contacts = None  # TODO

print("\n[2] Contacts (first 3):")
# print(contacts[:3])


# ── Exercise 3: Fetch posts for user 1 ────────────────────
# GET /posts?userId=1 and count how many posts user 1 has.

posts_response = None  # TODO
user1_posts    = None  # TODO: list of posts

print(f"\n[3] Posts by user 1: {len(user1_posts) if user1_posts else 'N/A'}")


# ── Exercise 4: Save contacts to CSV ──────────────────────
# Write 'contacts' list to 'contacts.csv' using the csv module.

output_file = "contacts.csv"
# TODO: open output_file with csv.DictWriter and write all contacts

print(f"\n[4] Saved contacts to {output_file}")


# ── Exercise 5: POST a new todo ────────────────────────────
new_todo = {
    "title": "Complete DAQS Lab 03",
    "completed": False,
    "userId": 1,
}
# TODO: POST new_todo to f"{BASE_URL}/todos" with json=new_todo
post_response = None

print(f"\n[5] Created todo (status {post_response.status_code if post_response else 'N/A'}):")
# print(post_response.json())

print("\n✅  Finished! Replace all None values to complete the lab.")
