// source/docker-top/stats.js

var dockerTopSortMetric = 'cpu';

function setSortMetric(metric) {
    dockerTopSortMetric = metric;
    updateDockerTop();
}

function updateDockerTop() {
    const container = $('#docker-top-list');

    if (container.find('.docker-top-table').length === 0) {
        container.html('<div class="docker-top-loading">Loading...</div>');
    }

    $.getJSON('/plugins/docker-top/get_stats.php', { sort: dockerTopSortMetric }, function (data) {
        container.empty();

        if (!data || data.length === 0) {
            container.html('<div class="docker-top-loading">No running containers found.</div>');
            return;
        }

        // Build table
        let html = '<table class="docker-top-table">';

        // Header row
        html += '<thead><tr>';
        html += '<th class="col-name">NAME</th>';
        html += `<th class="col-cpu ${dockerTopSortMetric === 'cpu' ? 'active' : ''}" onclick="setSortMetric('cpu')">CPU %<i class="fa ${dockerTopSortMetric === 'cpu' ? 'fa-sort-desc' : 'fa-sort'}"></i></th>`;
        html += '<th class="col-mem-usage">MEM USAGE / LIMIT</th>';
        html += `<th class="col-mem-pct ${dockerTopSortMetric === 'mem' ? 'active' : ''}" onclick="setSortMetric('mem')">MEM %<i class="fa ${dockerTopSortMetric === 'mem' ? 'fa-sort-desc' : 'fa-sort'}"></i></th>`;
        html += '</tr></thead>';

        // Data rows
        html += '<tbody>';
        data.forEach(function (item) {
            // CPU color class
            let cpuClass = 'usage-low';
            if (item.cpu > 50) cpuClass = 'usage-high';
            else if (item.cpu > 20) cpuClass = 'usage-med';

            // Mem color class
            let memClass = 'usage-low';
            if (item.mem_pct > 80) memClass = 'usage-high';
            else if (item.mem_pct > 50) memClass = 'usage-med';

            html += '<tr>';
            html += `<td class="col-name" title="${item.name}">${item.name}</td>`;
            html += `<td class="col-cpu ${cpuClass}">${item.cpu.toFixed(2)}%</td>`;
            html += `<td class="col-mem-usage">${item.mem_usage}</td>`;
            html += `<td class="col-mem-pct ${memClass}">${item.mem_pct.toFixed(2)}%</td>`;
            html += '</tr>';
        });
        html += '</tbody></table>';

        container.html(html);
    }).fail(function () {
        container.html('<div class="docker-top-loading" style="color:#d9534f">Failed to load stats.</div>');
    });
}
