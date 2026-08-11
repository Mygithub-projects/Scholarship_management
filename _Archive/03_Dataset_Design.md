# DATASET DESIGN DOCUMENT
# AGENTIC AI-POWERED SCHOLARSHIP MATCHING SYSTEM

## PURPOSE

This document defines all datasets required by the Agentic AI-Powered Scholarship Matching System.

All datasets will be stored in Excel format for prototype development.

---

# DATASET OVERVIEW

The system requires seven primary datasets:

1. Student Master Dataset
2. SPM Results Dataset
3. PAJSK Dataset
4. Psychometric Dataset
5. Student Aspiration Dataset
6. Parent Background Dataset
7. Scholarship Database

---

# DATASET 1
# STUDENT MASTER DATASET

File Name:
student_master.xlsx

Purpose:
Store basic student information.

Fields:

| Field | Description |
|---------|-------------|
| Student_ID | Unique Student ID |
| Name | Student Name |
| Email | Student Email |
| School | School Name |
| State | Student State |

Example:

| Student_ID | Name |
|------------|------|
| S001 | Ahmad |
| S002 | Ali |
| S003 | Nurul |

---

# DATASET 2
# SPM RESULTS DATASET

File Name:
spm_results.xlsx

Purpose:
Store academic performance.

Fields:

| Field |
|---------|
| Student_ID |
| BM |
| BI |
| Mathematics |
| Additional_Mathematics |
| Physics |
| Chemistry |
| Biology |
| History |
| Total_A |
| Academic_Score |

Example:

| Student_ID | BM | BI | Math |
|------------|----|----|------|
| S001 | A+ | A | A+ |

---

# DATASET 3
# PAJSK DATASET

File Name:
PAJSK_TERPERINCI.xlsx

Purpose:
Store co-curricular performance.

Fields:

| Field |
|---------|
| Student_ID |
| GPA |
| CGPA |
| Merit |
| Leadership |
| Participation |
| Achievement |
| Community_Service |
| NILAM |
| Competition_Level |

Example:

| Student_ID | GPA | CGPA |
|------------|------|------|
| S001 | 3.80 | 3.75 |

---

# DATASET 4
# PSYCHOMETRIC DATASET

File Name:
psychometric.xlsx

Purpose:
Store career interest and psychometric results.

Fields:

| Field |
|---------|
| Student_ID |
| RIASEC_Primary |
| RIASEC_Secondary |
| Career_Interest |
| Personality_Profile |

Example:

| Student_ID | RIASEC_Primary |
|------------|----------------|
| S001 | Investigative |

---

# DATASET 5
# STUDENT ASPIRATION DATASET

File Name:
student_aspiration.xlsx

Purpose:
Capture self-declared student aspirations.

Fields:

| Field |
|---------|
| Student_ID |
| Dream_Career |
| Preferred_Field |
| Personal_Interest |
| Study_Goal |

Example:

| Student_ID | Dream_Career |
|------------|--------------|
| S001 | Engineer |

Important:

Students may participate in activities due to parental influence.

Therefore self-declared interests must be included.

---

# DATASET 6
# PARENT BACKGROUND DATASET

File Name:
parent_background.xlsx

Purpose:
Store socioeconomic information.

Fields:

| Field |
|---------|
| Student_ID |
| Father_Occupation |
| Mother_Occupation |
| Parent_Category |

Parent Categories:

- B40
- M40
- T20

Example:

| Student_ID | Parent_Category |
|------------|-----------------|
| S001 | B40 |

Importance:

Many scholarships consider financial background during selection.

---

# DATASET 7
# SCHOLARSHIP DATABASE

File Name:
scholarship_database.xlsx

Purpose:
Store scholarship information and eligibility criteria.

Fields:

| Field |
|---------|
| Scholarship_Name |
| Provider |
| Academic_Requirement |
| PAJSK_Requirement |
| Preferred_Field |
| Parent_Category |
| Leadership_Requirement |
| Deadline |
| Notes |

Example:

| Scholarship_Name | Parent_Category |
|------------------|----------------|
| JPA | All |
| MARA | B40/M40 |

---

# SCHOLARSHIP MATCHING FACTORS

The matching engine should consider:

1. Academic Performance
2. PAJSK Performance
3. Psychometric Profile
4. Student Aspirations
5. Parent Socioeconomic Category

---

# RECOMMENDED MATCHING WEIGHT

Academic Achievement = 35%

PAJSK Achievement = 20%

Psychometric Profile = 15%

Student Aspiration = 15%

Parent Background = 15%

Total = 100%

---

# DUMMY DATA REQUIREMENT

Prototype Dataset:

Students:
10 Students

Scholarships:
15-20 Scholarships

Parent Categories:
B40, M40, T20

Psychometric Profiles:
RIASEC

Purpose:

Enable complete end-to-end testing of the prototype.

---

# FUTURE DATASET EXPANSION

Potential future datasets:

- PBD
- PBS
- SEGAK
- DELIMa Learning Analytics
- iDME Student Data

These datasets are not required for the current prototype.
