import pandas as pd
import matplotlib.pyplot as plt

# Read the data
df = pd.read_csv('data.csv', usecols=["Transaction Date", "Description",
                 "Category", "Debit"], parse_dates=["Transaction Date"])

# Define custom mappings
category_map = {
    'Health Care': 'Healthcare',
}

# Define drop list
categories_to_drop = ['Professional Services', 'Outer Banks Trip', "Cosmetics"]

# Update category for certain descriptions
df.loc[df['Description'].str.contains('salon', case=False, na=False),
       'Category'] = 'Cosmetics'
df.loc[df['Description'].str.contains('spa', case=False, na=False),
       'Category'] = 'Cosmetics'
df.loc[df['Description'].str.contains('sq', case=False, na=False),
       'Category'] = 'Outer Banks Trip'
df.loc[df['Description'].str.contains('kroger', case=False, na=False),
       'Category'] = 'groceries'

# Clean up data
df_clean = df.dropna(subset=['Category', 'Debit'])

df_clean['Category'] = (
    df_clean['Category']
    .str.strip()                 # Remove trailing whitespace
    .str.title()                 # Capitalize word
    .replace(category_map)       # Add custom mappings
)

# Drop categories
df_clean = df_clean[~df_clean['Category'].isin(categories_to_drop)]

grouped = df_clean.groupby('Category', as_index=False)['Debit'].sum()


def format_label(pct, allvals):
    absolute = (pct/100. * sum(allvals))
    return f"{pct:.1f}%\n(${absolute:,.2f})"


plt.pie(grouped['Debit'],
        labels=grouped['Category'],
        autopct=lambda pct: format_label(pct, grouped['Debit']),
        startangle=90)
plt.title('Credit History')
plt.axis('equal')  # Ensures pie chart is a circle

total = grouped['Debit'].sum()
plt.text(0, -1.2, f"Total: {total:,.2f}", ha='center', fontsize=12)

avg_spent = df_clean.groupby('Category')['Debit'].mean().reset_index()
print(avg_spent)
print(grouped)

plt.show()
