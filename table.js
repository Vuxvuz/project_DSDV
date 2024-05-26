// Load the CSV file
d3.csv('https://raw.githubusercontent.com/Vuxvuz/project_DSDV/main/covid19-provinces_vn_vi_v2.csv')
  .then(function(data) {
    console.log('Raw data:', data);

    // Parse numeric values
    data.forEach(d => {
      d['Tổng số ca lây nhiễm'] = +d['Tổng số ca lây nhiễm'];
      d['Số ca lây nhiễm mới'] = +d['Số ca lây nhiễm mới'];
      d['Tổng số ca tử vong'] = +d['Tổng số ca tử vong'];
    });

    console.log('Parsed data:', data);

    // Parse date values (assuming date format 'DD-MM-YYYY')
    const parseDate = d3.timeParse('%d-%m-%Y');
    data.forEach(d => {
      d['Ngày'] = parseDate(d['Ngày']);
    });

    // Create an HTML Table Element
    const table = d3.select('body')
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

    // Create table body
    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');

    // Create table cells
    rows.selectAll('td')
      .data(function(row) {
        return [
          row['Tỉnh'],
          row['Tổng số ca lây nhiễm'],
          row['Số ca lây nhiễm mới'],
          row['Tổng số ca tử vong'],
          row['Ngày']
        ];
      })
      .enter()
      .append('td')
      .text(function(d) { return d; });
  })
  .catch(function(error) {
    console.log('Error loading CSV file:', error);
  });
