// Load the CSV file with semicolon delimiter
d3.dsv(';', 'https://raw.githubusercontent.com/Vuxvuz/project_DSDV/main/covid19-provinces_vn_vi_v2.csv')
  .then(function(data) {
    console.log('Raw data:', data);

    // Parse numeric values and fix data type issues
    data.forEach(d => {
      d['Tổng số ca lây nhiễm'] = parseInt(d['Tổng số ca lây nhiễm'].replace(/\./g, '')) || 0;
      d['Số ca lây nhiễm mới'] = +d['Số ca lây nhiễm mới'] || 0;
      d['Tổng số ca tử vong'] = +d['Tổng số ca tử vong'] || 0;
    });

    console.log('Parsed data:', data);

    // Parse date values (assuming date format 'mm-dd-yyyy')
    const parseDate = d3.timeParse('%m-%d-%Y');
    data.forEach(d => {
      d['Ngày'] = parseDate(d['Ngày']);
    });

    // Sort data by "Ngày" in increasing order and then by "Tỉnh" in alphabetical order
    data.sort((a, b) => {
      if (a['Ngày'] < b['Ngày']) return -1;
      if (a['Ngày'] > b['Ngày']) return 1;
      if (a['Tỉnh'] < b['Tỉnh']) return -1;
      if (a['Tỉnh'] > b['Tỉnh']) return 1;
      return 0;
    });

    // Create an HTML Table Element
    const table = d3.select('#table-container')
      .append('table')
      .attr('class', 'table table-striped table-bordered');

    // Create table header row
    const thead = table.append('thead');
    const headerRow = thead.append('tr');
    headerRow.append('th').text('Tỉnh');
    headerRow.append('th').text('Tổng số ca lây nhiễm');
    headerRow.append('th').text('Số ca lây nhiễm mới');
    headerRow.append('th').text('Tổng số ca tử vong');
    headerRow.append('th').text('Ngày');

    // Function to update the table based on filters
    function updateTable(filteredData) {
      const tbody = table.select('tbody');
      tbody.selectAll('tr').remove(); // Clear existing rows

      const rows = tbody.selectAll('tr')
        .data(filteredData)
        .enter()
        .append('tr');

      rows.selectAll('td')
        .data(function(row) {
          return [
            row['Tỉnh'],
            row['Tổng số ca lây nhiễm'],
            row['Số ca lây nhiễm mới'],
            row['Tổng số ca tử vong'],
            row['Ngày'] ? d3.timeFormat('%d-%m-%Y')(row['Ngày']) : ''
          ];
        })
        .enter()
        .append('td')
        .text(function(d) { return d; });
    }

    // Initial data display
    const initialEntries = 10;
    table.append('tbody');
    updateTable(data.slice(0, initialEntries));

    // Event listener for row selector
    d3.select('#entries-dropdown').on('change', function() {
      const selectedValue = +this.value;
      updateTable(data.slice(0, selectedValue));
    });

    // Search function
    function performSearch() {
      const searchValue = d3.select('#search-input').property('value').toLowerCase();
      const selectedColumn = d3.select('#column-dropdown').property('value');
      
      const filteredData = data.filter(d => {
        if (selectedColumn === 'Ngày') {
          return d['Ngày'] && d3.timeFormat('%d-%m-%Y')(d['Ngày']).includes(searchValue);
        } else if (selectedColumn === 'Tổng số ca lây nhiễm' || selectedColumn === 'Số ca lây nhiễm mới' || selectedColumn === 'Tổng số ca tử vong') {
          const searchValueNum = parseInt(searchValue);
          if (!isNaN(searchValueNum)) {
            return d[selectedColumn] === searchValueNum;
          }
          return false;
        } else {
          return d[selectedColumn].toString().toLowerCase().includes(searchValue);
        }
      });

      updateTable(filteredData);
    }

    // Event listener for search button
    d3.select('#search-button').on('click', performSearch);

    // Event listener for Enter key on search input
    d3.select('#search-input').on('keypress', function(event) {
      if (event.keyCode === 13) {
        performSearch();
      }
    });
  })
  .catch(function(error) {
    console.log('Error loading CSV file:', error);
  });
