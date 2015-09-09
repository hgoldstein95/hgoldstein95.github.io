$(document).ready(function() {
	$('.front, .behind').click(function() {
		$('.card').toggleClass('open');
		$('.open-helper').toggleClass('open');
	});

	$('.back').click(function() {
		console.log('back');
		$('.card').toggleClass('full');
		$('.expanded-helper').toggleClass('full');
	});
});