<?php
// docker-stats configuration helper
$docker_stats_cfg_file = "/boot/config/plugins/docker-stats/docker-stats.cfg";
$docker_stats_cfg = @parse_ini_file($docker_stats_cfg_file) ?: [];

// Read CONTAINER_LIMIT with validation (5-50)
$docker_stats_container_limit = isset($docker_stats_cfg['CONTAINER_LIMIT']) ? intval($docker_stats_cfg['CONTAINER_LIMIT']) : 10;
if ($docker_stats_container_limit < 5) $docker_stats_container_limit = 5;
if ($docker_stats_container_limit > 50) $docker_stats_container_limit = 50;
?>
