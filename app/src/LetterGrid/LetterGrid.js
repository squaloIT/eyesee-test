import Grid from '@material-ui/core/Grid';
import React from 'react';

import './LetterGrid.css';

const LetterGrid = props => {
  return (
    <div className="block__game grid__abeceda">
      <Grid container spacing={0}>
        {
          props.alfabetForDisplay.map(alf => {
            return (<Grid item xs={2} className="grid__abeceda__row--mt-10" key={alf.letter}>
              <p className={`paper--font-big paper--color-${alf.score}`}>{alf.letter} ({alf.value})</p>
            </Grid>)
          })
        }
      </Grid>
    </div>
  )
}
export default LetterGrid;