import * as React from "react";
import styled from "@emotion/styled";

import { Button, Icon } from "semantic-ui-react";
import { ActionEvent } from "@/lib/realtime";
import { AddEventDropdown, EventActions } from "./EventActions";

import { EventActionConfig, actionComponents } from "@/containers/actions";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { EventModal } from "./EventModal";
import { NamedEventConfig } from "@/store/models/automator";
import { EventItem } from "./EventItem";
import { Action } from "@vinceau/event-actions";
import { ActionInput, AddActionInput } from "./ActionInputs";

const Header = styled.div`
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.foreground3};
  text-align: center;
  padding: 0.5rem 0;
  h2 {
    display: inline;
    margin-right: 1rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  border: solid 0.1rem ${({ theme }) => theme.foreground3};
  border-radius: 0.5rem;
`;

const LeftColumn = styled.div`
  width: 50%;
  overflow: hidden;
  overflow-y: auto;
`;
const RightColumn = styled.div`
  border-left: solid 0.1rem ${({ theme }) => theme.foreground3};
  width: 50%;
  overflow: hidden;
  overflow-y: auto;
`;

export const Automator: React.FC = () => {
  const [selected, setSelected] = React.useState<number>(0);
  const val = useSelector((state: iRootState) => state.automator.events);
  const actions = useSelector((state: iRootState) => state.automator.actions);
  const dispatch = useDispatch<Dispatch>();
  const selectedActions = val[selected] ? actions[val[selected].id] : [];
  const disabledActions = selectedActions.map((a) => a.name);
  const addEvent = (event: NamedEventConfig) => {
    dispatch.automator.addEvent(event);
  };
  const onActionChange = (index: number, action: Action) => {
    const eventId = val[selected].id;
    dispatch.automator.updateActionEvent({ eventId, index, action });
  };
  const onActionRemove = (index: number) => {
    const eventId = val[selected].id;
    dispatch.automator.removeActionEvent({ eventId, index });
  };
  const onActionAdd = (name: string) => {
    const eventId = val[selected].id;
    const params = actionComponents[name].defaultParams;
    const action = {
      name,
      args: params ? params() : {},
    };
    dispatch.automator.addNewEventAction({ eventId, action });
  };
  /*
  return (
    <div>
      {val.map((e, i) => {
        const onChange = (newVal: EventActionConfig) => {
          dispatch.slippi.updateActionEvent({
            index: i,
            event: newVal,
          });
        };
        const onRemove = () => {
          dispatch.slippi.removeActionEvent(i);
        };
        return (
          <EventActions
            key={e.event}
            disabledOptions={disabledEvents}
            value={e}
            onChange={onChange}
            onRemove={onRemove}
          />
        );
      })}
      <AddEventDropdown onChange={addEvent} disabledOptions={disabledEvents} />
    </div>
  );
  */

  return (
    <Container>
      <LeftColumn>
        <Header>
          <h2>Events</h2>
          <Icon name="flag outline" />
        </Header>
        <div>
          <EventModal onSubmit={addEvent}>
            <Button>Add event</Button>
          </EventModal>
          {val.map((e, i) => {
            return <EventItem key={e.id} selected={selected === i} onClick={() => setSelected(i)} event={e} />;
          })}
        </div>
      </LeftColumn>
      <RightColumn>
        <Header>
          <h2>Actions</h2>
          <Icon name="check square outline" />
        </Header>
        <div>
          {selectedActions.map((a, i) => {
            const onInnerActionChange = (newVal: Action) => {
              onActionChange(i, newVal);
            };
            const prefix = i === 0 ? "Then " : "And ";
            return (
              <ActionInput
                key={`${val[selected].id}--${a.name}`}
                selectPrefix={prefix}
                value={a}
                onChange={onInnerActionChange}
                disabledActions={[]}
                onRemove={() => onActionRemove(i)}
              />
            );
          })}
          <AddActionInput onChange={onActionAdd} disabledActions={disabledActions} />
        </div>
      </RightColumn>
    </Container>
  );
};
