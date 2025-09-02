import streamlit as st
import pandas as pd
from models.recommender import recommend_recipes

# Load dataset
df = pd.read_csv("recipes.csv")

# Streamlit UI
st.set_page_config(page_title="Smart Recipe Recommender", layout="centered")

st.title("🍲 Smart Recipe Recommender")
st.write("Enter the ingredients you have, and I'll suggest recipes!")

# Input box
user_ingredients = st.text_input("Enter ingredients (comma-separated):", "")

if st.button("Find Recipes"):
    if user_ingredients.strip() == "":
        st.warning("Please enter at least one ingredient.")
    else:
        results = recommend_recipes(user_ingredients, df)
        st.subheader("Top Recipe Suggestions:")
        for _, row in results.iterrows():
            st.markdown(f"### 🍴 {row['name']}")
            st.write(f"**Cuisine:** {row['cuisine']} | **Time:** {row['cooking_time']} mins | **Type:** {row['veg_nonveg']}")
            st.write(f"**Ingredients:** {row['ingredients']}")
            st.write(f"**Steps:** {row['steps']}")
            st.progress(min(1.0, row['score']))  # similarity score
            st.divider()
