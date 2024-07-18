<?php
$config = [];
$config['db_dsnw'] = 'sqlite:////var/db/roundcube.db?mode=0640';

$config['des_key'] = 'Change_me_I_am_example!!';
$config['plugins'] = [
    'archive',
    'zipdownload',
];

$config['default_host'] = 'prod';
$config['username_domain'] = array(
  'prod' => 'transbithub.com',
);

$config['smtp_server'] = 'prod';
