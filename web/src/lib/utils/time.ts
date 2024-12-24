/**
 * Calculate time from timestamp
 * 
 * @param number from
 * @param number to
 * 
 * @returns string with time
 */
export const calculateTime = ( t: any, from: number, to: number ): string => {

    // Set calculation time
    let calculate: number = to - from;

    // Set after variable
    let after: string = '';

    // Set before variable 
    let before: string = ' ' + t('ago');

    // Define calc variable
    let calc: number;

    // Verify if time is older than now
    if ( calculate < 0 ) {

        // Set absolute value of a calculated time
        calculate = Math.abs(calculate);

        // Set icon
        after = '';

        // Empty before
        before = '';

    }

    // Calculate time
    if ( calculate < 60 ) {

        // Return just now
        return after + t('just_now');

    } else if ( calculate < 3600 ) {

        // Divide to 60
        calc = calculate / 60;

        // Round the number
        calc = Math.round(calc);

        // Return time in minutes
        return after + calc + ' ' + t('minutes') + before;

    } else if ( calculate < 86400 ) {

        // Divide to hours
        calc = calculate / 3600;

        // Round the number
        calc = Math.round(calc);

        // Return time in hours
        return after + calc + ' ' + t('hours') + before;

    } else if ( calculate >= 86400 ) {

        // Divide time in days
        calc = calculate / 86400;

        // Round the number
        calc = Math.round(calc);

        // Return time in days
        return after + calc + ' '+ t('days') + before;

    } else {

        // Return unknown
        return t('never');
        
    }

};

/**
 * Convert string to timestamp
 * 
 * @param isoString 
 * @returns timestamp
 */
export const toTimeStamp = (isoString: string) => {
    return new Date(isoString).getTime();
};