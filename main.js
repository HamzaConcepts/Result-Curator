// Column labels in your desired order - only the ones we want to display
const columnLabels = [
    'Sr. #', 'Student ID', 'Student Name', 'Total (/360)', 'Total %age'
];

let currentData = [];
let originalData = []; // To store the original order

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

function sortData() {
    currentData.sort((a, b) => {
        // Sort by total marks (index 18)
        const valueA = parseFloat(a[18]) || 0; // Convert to number, default to 0 if invalid
        const valueB = parseFloat(b[18]) || 0;
        return valueB - valueA; // Descending order
    });
    
    displayData(currentData);
}

function resetData() {
    currentData = [...originalData]; // Restore original data
    displayData(currentData);
}

// Create and add buttons
function createButtons() {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.marginTop = '10px';
    controlsDiv.style.marginBottom = '10px';

    const sortButton = document.createElement('button');
    sortButton.textContent = 'Sort by Total Marks';
    sortButton.onclick = sortData;
    sortButton.style.marginRight = '10px';
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Order';
    resetButton.onclick = resetData;
    
    controlsDiv.appendChild(sortButton);
    controlsDiv.appendChild(resetButton);
    
    // Insert buttons after file input
    const fileInput = document.getElementById('csvFile');
    fileInput.parentNode.insertBefore(controlsDiv, fileInput.nextSibling);
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

            // Store original data order
            originalData = [...currentData];

            // Initial display
            displayData(currentData);
            createButtons(); // Create buttons after data is loaded
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