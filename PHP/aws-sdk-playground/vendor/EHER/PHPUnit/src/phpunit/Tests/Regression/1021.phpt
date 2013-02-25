--TEST--
#1021: Depending on a test that uses a data provider does not work
--FILE--
<?php
$_SERVER['argv'][1] = '--no-configuration';
$_SERVER['argv'][2] = 'Issue1021Test';
$_SERVER['argv'][3] = dirname(__FILE__).'/1021/Issue1021Test.php';

require_once dirname(dirname(dirname(__FILE__))) . '/PHPUnit/Autoload.php';
PHPUnit_TextUI_Command::main();
?>
--EXPECTF--
PHPUnit %s by Sebastian Bergmann.

..

Time: %i %s, Memory: %sMb

OK (2 tests, 1 assertion)
