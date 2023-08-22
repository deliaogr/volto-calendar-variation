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
export const onDragEnd = (dragResult, cells, updateEventData) => {
  const { source, destination } = dragResult;
  // if destination is not droppable or source is the same as destination, it will be kept in place
  if (!destination || destination?.droppableId === source?.droppableId) {
    return;
  }

  const sourceDay = cells[source.droppableId];
  const destinationDay = cells[destination.droppableId];
  const event = sourceDay.events[source.index];

  updateEventData(event, destinationDay, sourceDay);
};
