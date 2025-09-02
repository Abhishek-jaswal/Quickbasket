import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_recipes(user_ingredients: str, df: pd.DataFrame, top_n: int = 5):
    """
    Recommend recipes based on user ingredients.
    """
    vectorizer = CountVectorizer()
    vectors = vectorizer.fit_transform(df['ingredients'].tolist() + [user_ingredients])
    similarity = cosine_similarity(vectors[-1], vectors[:-1])
    df['score'] = similarity[0]
    return df.sort_values(by='score', ascending=False).head(top_n)
