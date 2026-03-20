**Dynamic Form Builder Application**

**Overview**

The **Dynamic Form Builder Application** is a web-based tool that allows users to:

1.  Dynamically create and configure forms with various field types.
    
2.  Use the configured forms to create records.
    
3.  Display the created records in a data grid with features like sorting, filtering, and pagination.
    

The application is built using **Angular** and follows a modular, component-based architecture with proper state management.

**Features**

**1. Form Builder**

*   Users can dynamically add, edit, and remove fields to define the structure of a form.
    
*   Supported field types:
    
    *   Text Field
        
    *   Integer Field
        
    *   Decimal Field
        
    *   Text Area
        
    *   Date Time
        
    *   Email
        
    *   Phone
        
    *   URL
        
*   Field properties:
    
    *   Field Type
        
    *   Field Title
        
    *   Required/Optional
        
*   Configured fields are displayed in a schema-like list.
    

**2. Dynamic Form Generation**

*   A data entry form is dynamically generated based on the configured fields.
    
*   The form:
    
    *   Renders appropriate HTML input types.
        
    *   Applies validation rules (e.g., required fields).
        
    *   Displays required field indicators.
        
*   Users can fill out the form and submit it to create new records.
    

3. Record Listing (Data Grid)

*   Submitted records are displayed in a data grid.
    
*   The grid dynamically adjusts columns based on the form schema.
    
*   Grid features:
    
    *   Sorting
        
    *   Filtering
        
    *   Pagination
        
    *   Row selection for bulk actions (e.g., delete)
        

**Setup Instructions**

**Prerequisites**

*   **Node.js** (v16 or higher)
    
*   **Angular CLI** (v15 or higher)
    

**Installation**

1.  Clone the repository:git clone cd 
    
2.  Install dependencies:npm install
    
3.  Run the development server:ng serve
    
4.  Open the application in your browser:http://localhost:4200Application Architecture
    

*   1. Component-Based Architecture
    
*   The application is divided into reusable, standalone components, each responsible for a specific feature or functionality.
    
*   **Key Components:**
    
*   **PropertiesPanelComponent**:
    
    *   Allows users to configure fields (e.g., title, type, required).
        
    *   Handles adding, editing, and removing fields.
        
*   **FieldsPanelComponent**:
    
    *   Displays a list of configured fields in a schema-like view.
        
*   **EmployeeFormComponent**:
    
    *   Dynamically generates a form based on the configured fields.
        
    *   Handles form submission to create new records.
        
*   **RecordsGridComponent**:
    
    *   Displays submitted records in a data grid.
        
    *   Integrates the [CustomTableComponent](vscode-file://vscode-app/private/var/folders/1l/k9bnrty515b2tly32dv93m4h0000gn/T/AppTranslocation/C3FDE45C-FA0B-4F3E-B3A3-118ECC2C6373/d/Visual Studio Code 2.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) for grid functionality.
        
*   [CustomTableComponent](vscode-file://vscode-app/private/var/folders/1l/k9bnrty515b2tly32dv93m4h0000gn/T/AppTranslocation/C3FDE45C-FA0B-4F3E-B3A3-118ECC2C6373/d/Visual Studio Code 2.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html):
    
    *   A reusable table component with features like sorting, filtering, pagination, and row selection.
        

**2. State Management**

The application uses **RxJS BehaviorSubjects** for state management, implemented in the FormStoreService.

**Key State Variables:**

*   **fields$**:
    
    *   Stores the list of configured fields.
        
    *   Used to dynamically generate forms and grid columns.
        
*   **records$**:
    
    *   Stores the list of submitted records.
        
    *   Used as the data source for the data grid.
        
*   **selectedField$**:
    
    *   Tracks the currently selected field for editing.
        

**State Management Features:**

*   Reactive updates: Components automatically update when the state changes.
    
*   Local storage persistence: The application persists state (fields and records) in local storage to maintain data across sessions.
    

3. Folder Structure

The project follows a clean and modular folder structure:

src/

├── app/

│   ├── core/

│   │   ├── models/                # Shared data models (e.g., FieldConfig, FieldType)

│   │   ├── services/              # State management services (e.g., FormStoreService)

│   ├── features/

│   │   ├── builder/               # Form builder components

│   │   │   ├── properties-panel-component/

│   │   │   ├── fields-panel-component/

│   │   ├── records/               # Record management components

│   │   │   ├── employee-form-component/

│   │   │   ├── records-grid-component/

│   ├── shared/

│   │   ├── components/            # Reusable components (e.g., CustomTableComponent)

│   ├── app.component.ts           # Root component

│   ├── app.module.ts              # Root module

**4. Reusable Components**

The application emphasizes reusability:

*   [CustomTableComponent](vscode-file://vscode-app/private/var/folders/1l/k9bnrty515b2tly32dv93m4h0000gn/T/AppTranslocation/C3FDE45C-FA0B-4F3E-B3A3-118ECC2C6373/d/Visual Studio Code 2.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html):
    
    *   A generic table component that can be used across different modules.
        
    *   Accepts dynamic column definitions and data.
        
*   **PropertiesPanelComponent**:
    
    *   A reusable panel for configuring fields.
        

**5. Dynamic Form and Grid**

*   **Dynamic Form**:
    
    *   The form is generated based on the fields$ state.
        
    *   Each field type renders the appropriate HTML input.
        
*   **Dynamic Grid**:
    
    *   The grid columns are derived from the fields$ state.
        
    *   The grid data is sourced from the records$ state.
        

**Assumptions**

1.  **Field IDs**:
    
    *   Each field has a unique id to ensure proper identification.
        
    *   IDs are generated using crypto.randomUUID() for uniqueness.
        
2.  **Record IDs**:
    
    *   Each record has a unique id for row selection and deletion.
        
3.  **Validation**:
    
    *   Only basic validation is implemented (e.g., required fields).
        
    *   Advanced validation (e.g., regex for email) can be added as needed.
        
4.  **Local Storage**:
    
    *   The application uses local storage to persist fields and records.
        
    *   This approach is suitable for small-scale applications but may need to be replaced with a backend API for larger systems.
        
5.  **Field Types**:
    
    *   The supported field types are limited to those specified in the requirements.
        
    *   Additional field types can be added by extending the FieldType model.
        

**Future Improvements**

1.  **Backend Integration**:
    
    *   Replace local storage with a backend API for better scalability.
        
2.  **Advanced Validation**:
    
    *   Add support for custom validation rules (e.g., regex, min/max values).
        
3.  **Grid Enhancements**:
    
    *   Add server-side pagination, filtering, and sorting.
        
4.  **Theming**:
    
    *   Add support for light and dark themes.
        

License

This project is licensed under the MIT License.