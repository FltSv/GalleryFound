import { ReactNode, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  DragEndEvent,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragStartEvent,
  UniqueIdentifier,
  DragOverlay,
  DraggableAttributes,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface DraggableListProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  renderItem: RenderItem<T>;
}

export const DraggableList = <T extends { id: string }>(
  props: DraggableListProps<T>,
) => {
  const { items, setItems, renderItem } = props;

  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const overlayItem = items.find(item => item.id === activeId);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      sensors={sensors}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <SortableItem item={item} key={item.id} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
      {overlayItem && (
        <DragOverlay>
          <SortableItem item={overlayItem} renderItem={renderItem} />
        </DragOverlay>
      )}
    </DndContext>
  );
};

interface SortableItemProps<T> {
  item: T;
  renderItem: RenderItem<T>;
}

const SortableItem = <T extends { id: string }>(
  props: SortableItemProps<T>,
) => {
  const { item, renderItem } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      className="rounded-md bg-white bg-opacity-50 p-1 shadow-md"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 5 : 0,
        opacity: isDragging ? 0.5 : 1,
      }}>
      {renderItem(item, {
        ...attributes,
        ...listeners,
        ...{ style: { cursor: 'grab' } },
      })}
    </div>
  );
};

type RenderItem<T> = (item: T, sortableProps: SortableProps) => ReactNode;

export type SortableProps = DraggableAttributes | SyntheticListenerMap;
