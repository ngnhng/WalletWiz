# WalletWiz
<img align="right" width="159px" src="./logo.png">

## Setup
1. Clone the repository
2. Run `yarn` to install dependencies
3. Start development
   - Run `yarn android` to start the app on Android
4. Link with Expo project: 
	- `yarn eas init --id 756e67df-1562-4452-be7f-e9cdf1306bfb`
5. Run `yarn lint` to lint the code
	- [Biomejs](https://biomejs.com) is used for linting
	- Using VSCode? Install the Biomejs extension for better linting experience

## Architecture

### Domain Driven Design
```mermaid
erDiagram
    USER ||--o{ EXPENSE : has
    EXPENSE ||--o{ CATEGORY : belongs_to
    OCRSERVICE ||--o{ RECEIPT : scans
    USER ||--o{ RECEIPT : uploads
    RECEIPT ||--o{ EXPENSE : generates

```

#### Boundary Context
```mermaid
graph LR
    subgraph "Financial Management"
        A[User] --> B[Expense]
        B --> C[Category]
        A --> D[Budget]
    end
    subgraph "OCR Bill Scanning"
        E[OCRService] --> F[ScannedReceipt]
        F --> G[ReceiptParser]
    end
    B --> F

```