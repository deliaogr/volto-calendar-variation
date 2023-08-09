// remove dragged event from source
const removeDraggedEvent = (sourceDay, source) => {
  return [
    ...sourceDay.events.slice(0, source.index),
    ...sourceDay.events.slice(source.index + 1),
  ];
};

// add dropped event to destination at desired position
const addDroppedEvent = (destinationDay, eventToMove, destination) => {
  return [
    ...destinationDay.events.slice(0, destination.index),
    eventToMove,
    ...destinationDay.events.slice(destination.index),
  ];
};

/**
 * Move the event to different destination at selected position or keep it in place
 * (will not reorder if source is the same as destination)
 * ex: source has droppableId: 1 and index: 0, destination has droppableId: 3 and index: 1
 * [{name: 1, events: [a,b]}, {name: 2, events: [*a,b]}, {name: 3, events: [a,b]},
 * {name: 4, events: [a,*a,b]}, {name: 5, events: [a,b]}]
 * @param {Object} dragResult
 * @param {Object} dragResult.destination
 * @param {String} dragResult.destination.droppableId
 * @param {Number} dragResult.destination.index
 * @param {Object} dragResult.source
 * @param {String} dragResult.source.droppableId
 * @param {Number} dragResult.source.index
 * @returns
 */
export const onDragEnd = (
  dragResult,
  cells,
  setPeriod,
  updateEvent,
  updateEventDates,
) => {
  const { source, destination } = dragResult;
  // if destination is not droppable or source is the same as destination, it will be kept in place
  if (!destination || destination?.droppableId === source?.droppableId) {
    return;
  }
  // make copy to make it safe to mutate, the source won't be changed
  const days = cells.slice();
  const sourceDay = days[source.droppableId];
  const destinationDay = days[destination.droppableId];
  const event = sourceDay.events[source.index];
  // replacing item in array is safe to mutate,
  // it won't change the original source
  days[source.droppableId] = {
    ...sourceDay,
    events: removeDraggedEvent(sourceDay, source),
  };
  days[destination.droppableId] = {
    ...destinationDay,
    events: addDroppedEvent(destinationDay, event, destination),
  };
  updateEventDates(event, destinationDay, updateEvent);
  setPeriod(days);
};
