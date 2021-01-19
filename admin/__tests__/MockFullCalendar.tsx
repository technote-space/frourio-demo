import type { CalendarOptions } from '@fullcalendar/react';
import type { DateClickArg } from '@fullcalendar/interaction';
import { Component, MutableRefObject } from 'react';

type CalendarProps = Required<Pick<CalendarOptions, 'loading' | 'dateClick' | 'events'>> & {
  dates: Record<string, Date[]>;
  calendarEvents: Record<string, { start: Date; end: Date; }[][]>;
  start: Date;
  end: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calendarRef: MutableRefObject<any>;
  target: string;
}
type CalendarState = {
  dateIndex: number;
  eventsIndex: number;
  isLoading: boolean;
}

export default class MockFullCalendar extends Component<CalendarProps, CalendarState> {
  state = {
    dateIndex: 0,
    eventsIndex: 0,
    isLoading: false,
  };

  constructor(props: CalendarProps) {
    super(props);
    props.calendarRef.current = this;
  }

  render() {
    return <div data-testid={`${this.props.target}-mock-calendar`} onClick={() => this.handleClick()}>
      {this.state.isLoading && <div data-testid={`${this.props.target}-mock-calendar-loading`}/>}
      {!this.state.isLoading && <div data-testid={`${this.props.target}-mock-calendar-not-loading`}/>}
    </div>;
  }

  handleClick() {
    this.props.dateClick({ date: this.props.dates[this.props.target][Math.min(this.state.dateIndex, this.props.dates[this.props.target].length - 1)] } as DateClickArg);
    this.setState(prevState => ({ dateIndex: prevState.dateIndex + 1 }));
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.props.loading(true);
    typeof this.props.events === 'function' && this.props.events(
      {
        start: this.props.start,
        end: this.props.end,
        startStr: '',
        endStr: '',
        timeZone: '',
      },
      () => {
        this.setState({ isLoading: false });
        this.props.loading(false);
      },
      jest.fn(),
    );
  }

  getApi() {
    return {
      getEvents: () => {
        const events = this.props.calendarEvents[this.props.target][Math.min(this.state.eventsIndex, this.props.calendarEvents[this.props.target].length - 1)];
        this.setState(prevState => ({ eventsIndex: prevState.eventsIndex + 1 }));
        return events;
      },
    };
  }
}
