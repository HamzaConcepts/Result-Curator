// Column labels in your desired order - only the ones we want to display
const columnLabels = [
    'Sr. #', 'Student ID', 'Student Name', 'Total (/360)', 'Total %age'
];

let currentData = [];

function displayData(data) {
    const container = document.getElementById('tableContainer');
    
    // Create table
    const table = document.createElement('table');
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    columnLabels.forEach(label => {
        const th = document.createElement('th');
        th.textContent = label;
        th.addEventListener('click', () => sortData(columnLabels.indexOf(label)));
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        // Map the indexes to get only the columns we want
        const desiredColumns = [0, 1, 2, 18, 19]; // Indexes of Sr.#, Student ID, Name, Total Marks, Total %age
        desiredColumns.forEach(colIndex => {
            const td = document.createElement('td');
            td.textContent = row[colIndex] || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Replace existing table if any
    container.innerHTML = '';
    container.appendChild(table);
}

function sortData(columnIndex) {
    const dataIndexMap = [0, 1, 2, 18, 19]; // Maps display columns to data columns
    const actualDataIndex = dataIndexMap[columnIndex];
    
    currentData.sort((a, b) => {
        const valueA = a[actualDataIndex];
        const valueB = b[actualDataIndex];
        
        // Try numeric sort first
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            return numB - numA;
        }
        
        // Fall back to string sort
        return valueA.localeCompare(valueB);
    });
    
    displayData(currentData);
}

document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            // Parse CSV
            const csvData = event.target.result;
            const rows = csvData.split('\n');
            currentData = rows.slice(1) // Skip header row
                .filter(row => row.trim()) // Remove empty rows
                .map(row => {
                    const values = row.split(',');
                    return values.map(value => value.trim());
                });

            // Initial display
            displayData(currentData);
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file. Please check the console for details.');
        }
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    };

    reader.readAsText(file);
});