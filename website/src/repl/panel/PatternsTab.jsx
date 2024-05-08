import {
  exportPatterns,
  importPatterns,
  patternFilterName,
  useActivePattern,
  useViewingPatternData,
  userPattern,
} from '../../user_pattern_utils.mjs';
import { useMemo } from 'react';
import { getMetadata } from '../../metadata_parser';
import { useExamplePatterns } from '../useExamplePatterns';
import { parseJSON } from '../util.mjs';
import { ButtonGroup } from './Forms.jsx';
import { settingsMap, useSettings } from '../../settings.mjs';
import NewTabIcon from '@heroicons/react/20/solid/ArrowTopRightOnSquareIcon';
import DuplicateIcon from '@heroicons/react/20/solid/DocumentDuplicateIcon';
import TrashIcon from '@heroicons/react/20/solid/TrashIcon';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function PatternLabel({ pattern } /* : { pattern: Tables<'code'> } */) {
  const meta = useMemo(() => getMetadata(pattern.code), [pattern]);

  let title = meta.title;
  if (title == null) {
    const date = new Date(pattern.created_at);
    if (!isNaN(date)) {
      title = date.toLocaleDateString();
    }
  }
  if (title == null) {
    title = pattern.hash;
  }
  if (title == null) {
    title = 'unnamed';
  }
  return <>{`${pattern.id}: ${title} by ${Array.isArray(meta.by) ? meta.by.join(',') : 'Anonymous'}`}</>;
}

function PatternActions({pattern, onNewTab, onDuplicate, onDelete}) {
  const id = pattern.id;
  return (
      <span className="absolute right-0">
        {onNewTab && (<NewTabIcon onClick={() => onNewTab(id)} className="cursor-pointer inline-block w-4 h-4 mr-2"/>)}
        {onDuplicate && (<DuplicateIcon onClick={() => onDuplicate(id)} className="cursor-pointer inline-block w-4 h-4 mr-2"/>)}
        {onDelete && (<TrashIcon onClick={() => onDelete(id)} className="cursor-pointer inline-block w-4 h-4 mr-2"/>)}
      </span>
  );
}

function getField(field, pattern, meta) {
  switch (field) {
    case 'by':
      return ` by ${Array.isArray(meta.by) ? meta.by.join(',') : 'Anonymous'}`;
    case 'title':
      let title = meta.title;
      if (title == null) {
        const date = new Date(pattern.created_at);
        if (!isNaN(date)) {
          title = date.toLocaleDateString();
        }
      }
      if (title == null) {
        title = pattern.hash;
      }
      if (title == null) {
        title = 'unnamed';
      }
      return title;
    case 'id':
      return pattern[field];
    case 'icon':
      const types = {
        'strudel': '🌀',
        'hydra': '🐙',
      };
      return types[meta.type];
    case 'project':
      return `(${meta.project})`;
    default:
      return meta[field];
  }
}

function PatternButton({fields, onClick, pattern}) {
  const meta = useMemo(() => getMetadata(pattern.code), [pattern]);
  return (
    <span
      onClick={onClick}
      className={classNames(
        'mr-4 hover:opacity-50 cursor-pointer',
      )}
    >
      {fields.map((field) => (
          <span key={field} className="inline-block mr-2">{getField(field, pattern, meta)}</span>
      ))}
    </span>
  );
}

function PatternButtons({ patterns, fields, activePattern, started, onClick, onNewTab, onDuplicate, onDelete }) {
  const viewingPatternStore = useViewingPatternData();
  const viewingPatternData = parseJSON(viewingPatternStore);
  const viewingPatternID = viewingPatternData.id;
  return (
    <div className="font-mono text-sm">
      {Object.values(patterns)
        .reverse()
        .map((pattern) => {
          const id = pattern.id;
          return (
              <div className={classNames(
                  (id === viewingPatternID) && 'bg-selection',
                  (id === activePattern) && started && 'outline outline-1',
                  'relative'
              )} key={id}>
                <PatternButton
                    fields={fields}
                    pattern={pattern}
                    onClick={() => onClick(id)}
                />
                {(onNewTab || onDuplicate || onDelete) && (
                    <PatternActions
                        pattern={pattern}
                        onNewTab={onNewTab}
                        onDuplicate={onDuplicate}
                        onDelete={onDelete}
                    />
                )}
              </div>
          );
        })}
    </div>
  );
}

function ActionButton({ children, onClick, label, labelIsHidden }) {
  return (
    <button className="hover:opacity-50" onClick={onClick} title={label}>
      {labelIsHidden !== true && label}
      {children}
    </button>
  );
}

export function PatternsTab({ context }) {
  const activePattern = useActivePattern();
  const viewingPatternStore = useViewingPatternData();
  const viewingPatternData = parseJSON(viewingPatternStore);

  const { userPatterns, patternFilter } = useSettings();

  const examplePatterns = useExamplePatterns();
  const collections = examplePatterns.collections;

  const updateCodeWindow = (patternData, reset = false) => {
    context.handleUpdate(patternData, reset);
  };
  const viewingPatternID = viewingPatternData?.id;

  const autoResetPatternOnChange = !window.parent?.location.pathname.includes('oodles');

  return (
    <div className="px-4 w-full dark:text-white text-stone-900 space-y-2 pb-4 flex flex-col overflow-hidden max-h-full">
      <ButtonGroup
        value={patternFilter}
        onChange={(value) => settingsMap.setKey('patternFilter', value)}
        items={patternFilterName}
      ></ButtonGroup>
      {patternFilter === patternFilterName.user && (
        <div>
          <div className="pr-4 space-x-4 border-b border-foreground flex max-w-full overflow-x-auto">
            <ActionButton
              label="new"
              onClick={() => {
                const { data } = userPattern.createAndAddToDB();
                updateCodeWindow(data);
              }}
            />
            <label className="hover:opacity-50 cursor-pointer">
              <input
                style={{ display: 'none' }}
                type="file"
                multiple
                accept="text/plain,application/json"
                onChange={(e) => importPatterns(e.target.files)}
              />
              import
            </label>
            <ActionButton label="export" onClick={exportPatterns} />

            <ActionButton
              label="delete-all"
              onClick={() => {
                const { data } = userPattern.clearAll();
                updateCodeWindow(data);
              }}
            />
          </div>
        </div>
      )}

      <section className="flex overflow-y-scroll max-h-full flex-col">
        {patternFilter === patternFilterName.user && (
          <PatternButtons
            onClick={(id) =>
              updateCodeWindow({ ...userPatterns[id], collection: userPattern.collection }, autoResetPatternOnChange)
            }
            onNewTab={(id) => {
              const url = `?${id}`;
              window.open(url, '_blank').focus();
            }}
            onDuplicate={(id) => {
              const { data } = userPattern.duplicate(id);
              updateCodeWindow(data);
            }}
            onDelete={(id) => {
              const { data } = userPattern.delete(id);
              updateCodeWindow({ ...data, collection: userPattern.collection });
            }}
            patterns={userPatterns}
            fields={['icon', 'title', 'project', 'actions']}
            started={context.started}
            activePattern={activePattern}
            viewingPatternID={viewingPatternID}
          />
        )}
        {patternFilter !== patternFilterName.user &&
          Array.from(collections.keys()).map((collection) => {
            const patterns = collections.get(collection);
            return (
              <section key={collection} className="py-2">
                <h2 className="text-xl mb-2">{collection}</h2>
                <div className="font-mono text-sm">
                  <PatternButtons
                    onClick={(id) => updateCodeWindow({ ...patterns[id], collection }, autoResetPatternOnChange)}
                    started={context.started}
                    patterns={patterns}
                    fields={['id', 'title', 'by', 'actions']}
                    activePattern={activePattern}
                  />
                </div>
              </section>
            );
          })}
      </section>
    </div>
  );
}
