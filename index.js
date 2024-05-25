// Load the CSV file
d3.csv('https://raw.githubusercontent.com/Vuxvuz/project_DSDV/main/covid19-provinces_vn_vi_v2.csv')
  .then(function(data) {
    // Create an HTML Table Element
    const table = d3.select('body')
      .append('table')
      .attr('class', 'table table-striped table-bordered');

    // Create table header row
    const thead = table.append('thead');
    const headerRow = thead.append('tr');
    headerRow.append('th').text('Province');
    headerRow.append('th').text('Total infected cases');
    headerRow.append('th').text('Today infected cases');
    headerRow.append('th').text('Deaths');
    headerRow.append('th').text('Date');

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
          row['Province'],
          row['Total infected cases'],
          row['Today infected cases'],
          row['Deaths'],
          row['Date']
        ];
      })
      .enter()
      .append('td')
      .text(function(d) { return d; });
  })
  .catch(function(error) {
    console.log('Error loading CSV file:', error);
  });