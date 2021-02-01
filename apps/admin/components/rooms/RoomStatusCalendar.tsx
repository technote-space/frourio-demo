import type { FC } from 'react';
import type { AuthHeader } from '@frourio-demo/types';
import { memo, useState, useCallback } from 'react';
import { IconButton, Dialog } from '@material-ui/core';
import { Today as TodayIcon } from '@material-ui/icons';
import { useTheme } from '@material-ui/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { client, handleAuthError } from '~/utils/api';
import { useDispatchContext } from '~/store';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

type Props = {
  authHeader: AuthHeader;
  roomId: number;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  calendar: {
    margin: theme.spacing(3),
  },
}));

const RoomStatusCalendar: FC<Props> = memo(({ authHeader, roomId }: Props) => {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const { dispatch } = useDispatchContext();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const fetchEvents = useCallback((info, successCallback) => {
    handleAuthError(dispatch, [], client.rooms.calendar.get, {
      headers: authHeader,
      query: {
        roomId,
        start: info.start,
        end: info.end,
      },
    }).then(data => {
      successCallback(data.map(item => ({
        ...item,
        color: theme.palette.primary.main,
        textColor: theme.palette.primary.contrastText,
      })));
    });
  }, []);

  return <>
    <IconButton onClick={handleOpen} data-testid="room-status">
      <TodayIcon/>
    </IconButton>
    <Dialog open={open} onClose={handleClose}>
      <div className={classes.calendar}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={fetchEvents}
          height="auto"
        />
      </div>
    </Dialog>
  </>;
});

RoomStatusCalendar.displayName = 'RoomStatusCalendar';
export default RoomStatusCalendar;
