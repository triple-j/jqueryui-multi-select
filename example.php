<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

		<title>jQuery UI Multi-Select Widget</title>

		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>

		<script src="jquery-ui.multi-select.js"></script>

		<style>
			select[multiple] {
				min-width: 12em;
				min-height: 16em;
			}
		</style>

		<script>
			$( document ).ready(function() {
				$('#enhanced').multiselect();
			});
		</script>

	</head>
	<body>
		<section>
			<h1>Original</h1>
			<select multiple>
				<optgroup label="Group 1">
					<option>Option 1.1</option>
				</optgroup>
				<optgroup label="Group 2">
					<option selected>Option 2.1</option>
					<option>Option 2.2</option>
				</optgroup>
				<optgroup label="Group 3" disabled>
					<option>Option 3.1</option>
					<option>Option 3.2</option>
					<option>Option 3.3</option>
				</optgroup>
			</select>
		</section>


		<section>
			<h1>Enhanced</h1>
			<form>

			<select id="enhanced" name="multiselect[]" multiple>
				<optgroup label="Group 1">
					<option>Option 1.1</option>
				</optgroup>
				<optgroup label="Group 2">
					<option selected>Option 2.1</option>
					<option>Option 2.2</option>
				</optgroup>
				<optgroup label="Group 3" disabled>
					<option>Option 3.1</option>
					<option>Option 3.2</option>
					<option>Option 3.3</option>
				</optgroup>
			</select>

			<input type="submit" name="process" />
			</form>
		</section>


		<?php if ( isset($_REQUEST['process']) ): ?>
		<section>
			<pre><?php print_r($_REQUEST); ?></pre>
		</section>
		<?php endif; ?>

	</body>
</html>
