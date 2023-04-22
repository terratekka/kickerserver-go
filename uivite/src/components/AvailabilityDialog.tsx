import * as React from 'react';
import { useContext, useEffect, useReducer, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Availability } from './Availability';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import { TimeField } from '@mui/x-date-pickers';

export default function AvailabilityDialog({ availability, isDialogOpened, handleCloseDialog }: any) {
  React.useEffect(() => {
    handleClickOpen();
  }, []);

  const handleClickOpen = () => {
    console.log('AvailabilityDialog handleClickOpen')
  };

  const handleSave = () => {
    handleCloseDialog(availability);
  };

  const handleCancel = () => {
    handleCloseDialog();
  };

  const handleStartChange = (event: any) => {
    const value = event.$d as Date;
    availability.range.start = value
    console.log('handleStartChange value=', value);
  }

  const handleEndChange = (event: any) => {
    const value = event.$d;
    availability.range.end = value
    console.log('handleEndChange value=', value);
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={isDialogOpened}>
          <DialogTitle>Define available Time</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please change or create available Time
            </DialogContentText>

            <TimeField
              label={'Start'}
              value={availability?.range?.start ? dayjs(availability.range.start) : ""}
              format="HH:mm"
              className='mt-2 me-2'
              onChange={handleStartChange}
            />
            <TimeField
              label={'End'}
              value={availability?.range?.start ? dayjs(availability.range.end) : ""}
              format="HH:mm"
              className='mt-2 me-2'
              onChange={handleEndChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </div>
  );
}