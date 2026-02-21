"""
ALIGNIQ — Train Model Script
Generates synthetic career dataset and trains a Random Forest classifier.

For viva: Random Forest combines multiple decision trees to reduce overfitting.
It also gives feature importance scores, so we can show exactly which factors
most influenced the prediction. It's interpretable, which matters for a career guidance system.
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score
import joblib

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "career_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "career_model.pkl")


# Domain labels
CAREER_LABELS = [
    "AI/ML Engineer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Cybersecurity Analyst",
    "Embedded Systems Engineer",
]


def generate_synthetic_dataset(n_samples: int = 1200) -> pd.DataFrame:
    """
    Generate a synthetic career dataset for training.

    Features:
    - cgpa_norm (0-1)
    - backlogs (0-3)
    - aptitude_norm (0-1)
    - consistency (0-2)
    - internships (0-3)
    - projects (0-10)
    - hackathons (0-10)
    - leadership (0 or 1)
    - skills_count (0-30)
    - self_rating (1-10)
    """
    np.random.seed(42)

    records = []
    samples_per_class = n_samples // len(CAREER_LABELS)

    for label in CAREER_LABELS:
        for _ in range(samples_per_class):
            if label == "AI/ML Engineer":
                cgpa = np.random.uniform(0.65, 1.0)
                backlogs = np.random.choice([0, 0, 0, 1], p=[0.7, 0.1, 0.1, 0.1])
                aptitude = np.random.uniform(0.6, 1.0)
                consistency = np.random.choice([1, 2, 2])
                internships = np.random.choice([1, 2, 2, 3])
                projects = np.random.randint(3, 8)
                hackathons = np.random.randint(1, 6)
                leadership = np.random.choice([0, 1], p=[0.6, 0.4])
                skills_count = np.random.randint(6, 15)
                self_rating = np.random.randint(6, 10)

            elif label == "Full Stack Developer":
                cgpa = np.random.uniform(0.5, 0.9)
                backlogs = np.random.choice([0, 0, 1, 1])
                aptitude = np.random.uniform(0.5, 0.9)
                consistency = np.random.choice([1, 1, 2])
                internships = np.random.choice([1, 1, 2, 2])
                projects = np.random.randint(4, 10)
                hackathons = np.random.randint(2, 7)
                leadership = np.random.choice([0, 1], p=[0.5, 0.5])
                skills_count = np.random.randint(8, 20)
                self_rating = np.random.randint(5, 9)

            elif label == "Data Scientist":
                cgpa = np.random.uniform(0.6, 0.95)
                backlogs = np.random.choice([0, 0, 0, 1])
                aptitude = np.random.uniform(0.65, 1.0)
                consistency = np.random.choice([1, 2, 2])
                internships = np.random.choice([1, 1, 2, 3])
                projects = np.random.randint(2, 7)
                hackathons = np.random.randint(0, 4)
                leadership = np.random.choice([0, 1], p=[0.7, 0.3])
                skills_count = np.random.randint(5, 12)
                self_rating = np.random.randint(5, 9)

            elif label == "DevOps Engineer":
                cgpa = np.random.uniform(0.5, 0.85)
                backlogs = np.random.choice([0, 1, 1, 2])
                aptitude = np.random.uniform(0.5, 0.85)
                consistency = np.random.choice([0, 1, 1])
                internships = np.random.choice([0, 1, 2, 2])
                projects = np.random.randint(2, 6)
                hackathons = np.random.randint(0, 3)
                leadership = np.random.choice([0, 1], p=[0.5, 0.5])
                skills_count = np.random.randint(5, 12)
                self_rating = np.random.randint(5, 8)

            elif label == "Cybersecurity Analyst":
                cgpa = np.random.uniform(0.55, 0.9)
                backlogs = np.random.choice([0, 0, 1, 1])
                aptitude = np.random.uniform(0.55, 0.9)
                consistency = np.random.choice([0, 1, 2])
                internships = np.random.choice([0, 1, 1, 2])
                projects = np.random.randint(1, 5)
                hackathons = np.random.randint(1, 5)
                leadership = np.random.choice([0, 1], p=[0.6, 0.4])
                skills_count = np.random.randint(4, 10)
                self_rating = np.random.randint(4, 8)

            else:  # Core Engineering / Embedded Systems
                cgpa = np.random.uniform(0.6, 0.95)
                backlogs = np.random.choice([0, 0, 1, 2])
                aptitude = np.random.uniform(0.5, 0.85)
                consistency = np.random.choice([1, 1, 2])
                internships = np.random.choice([0, 0, 1, 1])
                projects = np.random.randint(1, 5)
                hackathons = np.random.randint(0, 3)
                leadership = np.random.choice([0, 0, 1])
                skills_count = np.random.randint(3, 8)
                self_rating = np.random.randint(4, 8)

            # Add noise
            cgpa = np.clip(cgpa + np.random.normal(0, 0.05), 0, 1)
            aptitude = np.clip(aptitude + np.random.normal(0, 0.05), 0, 1)

            records.append({
                "cgpa_norm": round(cgpa, 3),
                "backlogs": int(backlogs),
                "aptitude_norm": round(aptitude, 3),
                "consistency": int(consistency),
                "internships": int(internships),
                "projects": int(projects),
                "hackathons": int(hackathons),
                "leadership": int(leadership),
                "skills_count": int(skills_count),
                "self_rating": int(self_rating),
                "career_label": label,
            })

    df = pd.DataFrame(records)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df


def train_model():
    """Train Random Forest classifier and save as .pkl"""
    print("=" * 60)
    print("ALIGNIQ — Model Training Pipeline")
    print("=" * 60)

    # Generate or load dataset
    if os.path.exists(DATA_PATH):
        print(f"\n[1/4] Loading existing dataset from {DATA_PATH}")
        df = pd.read_csv(DATA_PATH)
    else:
        print("\n[1/4] Generating synthetic dataset (1200 samples)...")
        df = generate_synthetic_dataset(1200)
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        df.to_csv(DATA_PATH, index=False)
        print(f"  → Saved to {DATA_PATH}")

    print(f"  → Dataset shape: {df.shape}")
    print(f"  → Class distribution:\n{df['career_label'].value_counts().to_string()}")

    # Prepare features and labels
    feature_cols = ["cgpa_norm", "backlogs", "aptitude_norm", "consistency",
                    "internships", "projects", "hackathons", "leadership",
                    "skills_count", "self_rating"]

    X = df[feature_cols].values
    y = df["career_label"].values

    # Train/test split (80/20)
    print("\n[2/4] Splitting data (80% train / 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"  → Train: {X_train.shape[0]} samples")
    print(f"  → Test: {X_test.shape[0]} samples")

    # Train Random Forest
    print("\n[3/4] Training RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="weighted")

    print(f"\n  → Accuracy: {accuracy:.4f}")
    print(f"  → F1 Score (weighted): {f1:.4f}")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred))

    # Feature importance
    importances = model.feature_importances_
    print("  Feature Importance:")
    for name, imp in sorted(zip(feature_cols, importances), key=lambda x: -x[1]):
        bar = "█" * int(imp * 50)
        print(f"    {name:20s} {imp:.3f} {bar}")

    # Save model
    print(f"\n[4/4] Saving model to {MODEL_PATH}")
    joblib.dump(model, MODEL_PATH)
    print(f"  → Model saved successfully!")
    print("=" * 60)

    return model


if __name__ == "__main__":
    train_model()
