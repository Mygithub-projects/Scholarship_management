# SYSTEM ARCHITECTURE
# AGENTIC AI-POWERED SCHOLARSHIP MATCHING SYSTEM

## OVERVIEW

This document describes the architecture, workflow, AI agents, user roles, user interface requirements and technical implementation of the Agentic AI-Powered Scholarship Matching System.

---

# SYSTEM ARCHITECTURE

Student Login
↓
Student Database
↓
SPM Results Dataset
↓
PAJSK Dataset
↓
Psychometric Dataset
↓
Student Aspiration Dataset
↓
Parent Background Dataset
↓
Academic Profiling Agent
↓
PAJSK Analysis Agent
↓
Psychometric & Aspiration Agent
↓
Scholarship Matching Agent
↓
Recommendation & Reasoning Agent
↓
Top 5 Recommended Scholarships
↓
Notification Agent
↓
Student Dashboard

---

# SIX AI AGENTS

## Agent 1 - Academic Profiling Agent

Purpose:
Analyse academic achievement.

Input:
- SPM Results

Output:
- Academic Profile
- Academic Score
- Subject Strength Analysis

---

## Agent 2 - PAJSK Analysis Agent

Purpose:
Analyse co-curricular performance.

Input:
- PAJSK Dataset

Output:
- Leadership Profile
- Co-curricular Profile
- Achievement Summary

---

## Agent 3 - Psychometric & Aspiration Agent

Purpose:
Analyse interests, aspirations and career tendencies.

Input:
- Psychometric Dataset
- Student Aspiration Dataset

Output:
- Interest Profile
- Career Profile
- Aspiration Profile

---

## Agent 4 - Scholarship Matching Agent

Purpose:
Match students with scholarships.

Input:
- Academic Profile
- PAJSK Profile
- Psychometric Profile
- Parent Background
- Scholarship Database

Output:
- Ranked Scholarships
- Match Scores

---

## Agent 5 - Recommendation & Reasoning Agent

Purpose:
Explain recommendation decisions.

Output:
- Recommendation Explanation
- Eligibility Analysis
- Match Percentage

---

## Agent 6 - Notification Agent

Purpose:
Send scholarship alerts and reminders.

Output:
- Email Notifications
- Deadline Alerts

---

# USER ROLES

## Student

Functions:
- Login
- View recommendations
- Update aspirations
- View notifications

## Teacher / Counsellor

Functions:
- View student profiles
- Review recommendations
- Monitor student progress

## Administrator

Functions:
- Manage scholarship database
- Manage datasets
- Manage notifications

---

# USER INTERFACE

Design Philosophy:
DELIMa-inspired educational platform.

Requirements:
- Clean layout
- White background
- Blue and purple accents
- Mobile responsive
- Desktop responsive
- English support
- Bahasa Melayu support

---

# TECHNOLOGY STACK

Backend:
- Google AI Studio (Gemini)
- Python
- FastAPI
- Pandas
- OpenPyXL

Frontend:
- HTML
- CSS
- JavaScript

Server:
- Uvicorn

Data Storage:
- Excel Files

---

# EXPECTED OUTPUTS

- Top 5 Recommended Scholarships
- Match Percentage
- Recommendation Explanation
- Eligibility Analysis
- Deadline Reminder
- Email Notification Status
