# import matplotlib.pyplot as plt
# import numpy as np
 
# x = np.arange(1, 11)
# y = np.array([56, 62, 58, 70, 65, 72, 80, 75, 90, 85])
 
# plt.figure(figsize=(6, 4))
# plt.plot(x, y, marker='o', color='steelblue')
# plt.title('Student Scores Trend')
# plt.xlabel('Student ID (23BCP096)')
# plt.ylabel('Score')
# plt.grid(True, alpha=0.3)
# plt.show()

# import pandas as pd
# import seaborn as sns
# import matplotlib.pyplot as plt
# from sklearn.datasets import load_iris

# # Load Iris dataset
# iris = load_iris(as_frame=True)
# df = iris.frame

# # Plot
# plt.figure(figsize=(8,6))

# sns.heatmap(
#     df.corr(numeric_only=True),
#     annot=True,
#     cmap="RdYlBu",
#     linewidths=0.7,
#     fmt=".2f",
#     square=True
# )

# plt.title("Correlation Heatmap - Iris Dataset", fontsize=15)
# plt.tight_layout()
# plt.show()

import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    'branch': ['CSE', 'ICT', 'EE', 'ME'],
    'avg_score': [78, 74, 69, 66]
})
 
fig = px.bar(df, x='branch', y='avg_score', color='branch',
             title='Average Score by Branch')
fig.show()
