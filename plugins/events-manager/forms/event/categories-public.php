<?php
/**
 * Bookings
 *
 * @package WordPress
 * @subpackage community-portal
 * @version 1.0.0
 * @author  Playground Inc.
 */

	$em_event            = $GLOBALS['EM_Event'];
	$categories          = EM_Categories::get(
		array(
			'orderby'    => 'name',
			'hide_empty' => 0,
		)
	);
	$current_translation = mozilla_get_current_translation();


	?>
<?php if ( count( $categories ) > 0 ) : ?>
	<div class="event-categories event-creator__container">
		<!-- START Categories -->
		<fieldset class="event-creator__fieldset" id="event_categories[]">
			<legend class="event-creator__label" for="event_categories[]"><?php esc_html_e( 'Select a tag for your event', 'community-portal' ); ?></legend>
			<?php
				$selected = $em_event->get_categories()->get_ids();
			?>

			<?php	foreach ( $categories as $category ) : ?>
				<?php $term_object = mozilla_get_translated_tag( $category ); ?>
				<input 
					name="event_categories[]" 
					class="event-creator__checkbox" 
					id="<?php echo esc_attr( $category->id ); ?>"
					type="radio"  
					value="<?php echo esc_attr( $category->id ); ?>"
					<?php
					if ( is_array( $selected ) && ! empty( $selected ) && intval( $category->id ) === intval( $selected[0] ) ) {
						echo esc_attr( 'checked' );
					}
					?>
				/>
				<label class="event-creator__tag" for="<?php echo esc_attr( $category->id ); ?>"><?php echo esc_html( $term_object->name ); ?></label>
				<?php
				endforeach;
			?>
			<!-- <input type="hidden" name="event_categories[]" id="event_categories--all" value=""> -->
			<!-- END Categories -->
		</fieldset>
	</div>
<?php endif; ?>
