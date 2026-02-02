// source/docker-top/stats.js

var dockerTopSortMetric = 'cpu';

function setSortMetric(metric) {
    dockerTopSortMetric = metric;
    updateDockerTop();
}

function updateDockerTop() {
    const container = $('#docker-top-list');

    if (container.find('.docker-top-grid').length === 0) {
        container.html('<div class="docker-top-loading">Loading...</div>');
    }

    $.getJSON('/plugins/docker-top/get_stats.php', { sort: dockerTopSortMetric }, function (data) {
        container.empty();

        if (!data || data.length === 0) {
            container.html('<div class="docker-top-loading">No running containers found.</div>');
            return;
        }

        // Build grid layout with divs
        let html = '<div class="docker-top-grid">';

        // Header row
        html += '<div class="docker-top-header-row">';
        html += '<div class="docker-top-cell docker-top-col-name">NAME</div>';
        html += `<div class="docker-top-cell docker-top-col-cpu docker-top-sortable ${dockerTopSortMetric === 'cpu' ? 'active' : ''}" onclick="setSortMetric('cpu')">CPU %<i class="fa ${dockerTopSortMetric === 'cpu' ? 'fa-sort-desc' : 'fa-sort'}"></i></div>`;
        html += '<div class="docker-top-cell docker-top-col-mem-usage">MEM USAGE</div>';
        html += `<div class="docker-top-cell docker-top-col-mem-pct docker-top-sortable ${dockerTopSortMetric === 'mem' ? 'active' : ''}" onclick="setSortMetric('mem')">MEM %<i class="fa ${dockerTopSortMetric === 'mem' ? 'fa-sort-desc' : 'fa-sort'}"></i></div>`;
        html += '</div>';

        // Data rows
        data.forEach(function (item) {
            // CPU color class
            let cpuClass = 'usage-low';
            if (item.cpu > 50) cpuClass = 'usage-high';
            else if (item.cpu > 20) cpuClass = 'usage-med';

            // Mem color class
            let memClass = 'usage-low';
            if (item.mem_pct > 80) memClass = 'usage-high';
            else if (item.mem_pct > 50) memClass = 'usage-med';

            html += '<div class="docker-top-data-row">';
            html += `<div class="docker-top-cell docker-top-col-name" title="${item.name}">${item.name}</div>`;
            html += `<div class="docker-top-cell docker-top-col-cpu ${cpuClass}">${item.cpu.toFixed(2)}%</div>`;
            html += `<div class="docker-top-cell docker-top-col-mem-usage">${item.mem_usage}</div>`;
            html += `<div class="docker-top-cell docker-top-col-mem-pct ${memClass}">${item.mem_pct.toFixed(2)}%</div>`;
            html += '</div>';
        });

        html += '</div>';
        container.html(html);
    }).fail(function () {
        container.html('<div class="docker-top-loading" style="color:#d9534f">Failed to load stats.</div>');
    });
}
