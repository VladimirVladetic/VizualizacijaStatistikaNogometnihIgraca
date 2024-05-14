import pandas as pd

def processDataset(dataset_path):
    df = pd.read_csv(dataset_path)

    df['National_Position'].fillna('NA', inplace=True)
    df['National_Kit'].fillna('NA', inplace=True)

    df.dropna(inplace=True)

    empty_fields = {}
    for column in df.columns:
        num_empty = df[column].isnull().sum()
        empty_fields[column] = num_empty

    for column, count in empty_fields.items():
        print(f"Column '{column}' has {count} empty fields.")

    augmented_dataset_path = dataset_path.replace('.csv', '_augmented.csv')
    df.to_csv(augmented_dataset_path, index=False)

dataset_path = "FullData.csv"
processDataset(dataset_path)
