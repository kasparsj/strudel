import {
  exportPatterns,
  importPatterns,
  patternFilterName,
  useActivePattern,
  useViewingPatternData,
  userPattern,
} from '../../user_pattern_utils.mjs';
import { useMemo, useState } from 'react';
import { getMetadata } from '../../metadata_parser';
import { useExamplePatterns } from '../useExamplePatterns';
import { parseJSON } from '../util.mjs';
import { ButtonGroup } from './Forms.jsx';
import { settingsMap, useSettings } from '../../settings.mjs';
import NewTabIcon from '@heroicons/react/20/solid/ArrowTopRightOnSquareIcon';
import DuplicateIcon from '@heroicons/react/20/solid/DocumentDuplicateIcon';
import TrashIcon from '@heroicons/react/20/solid/TrashIcon';
import ListViewIcon from '@heroicons/react/20/solid/ListBulletIcon';
import ThumbViewIcon from '@heroicons/react/20/solid/Squares2X2Icon';
import SearchIcon from '@heroicons/react/20/solid/MagnifyingGlassIcon';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function PatternLabel({ pattern } /* : { pattern: Tables<'code'> } */) {
  const meta = useMemo(() => pattern.meta || getMetadata(pattern.code), [pattern]);

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

function PatternActions({ pattern, onNewTab, onDuplicate, onDelete }) {
  const id = pattern.id;
  return (
    <span className="absolute right-0">
      {onNewTab && (
        <NewTabIcon
          onClick={() => onNewTab(id)}
          className="cursor-pointer inline-block w-4 h-4 mr-2 hover:opacity-50"
        />
      )}
      {onDuplicate && (
        <DuplicateIcon
          onClick={() => onDuplicate(id)}
          className="cursor-pointer inline-block w-4 h-4 mr-2 hover:opacity-50"
        />
      )}
      {onDelete && (
        <TrashIcon onClick={() => onDelete(id)} className="cursor-pointer inline-block w-4 h-4 mr-2 hover:opacity-50" />
      )}
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
        strudel: '🌀',
        str: '🌀',
        hydra: '🐙',
        tag: '@',
        genre: '🎼',
        album: '💽',
        project: '💽',
        by: '⭐',
      };
      return types[meta.type];
    case 'project':
      return `(${meta.project})`;
    default:
      return meta[field];
  }
}

function PatternButton({ fields, onClick, pattern }) {
  const meta = useMemo(() => pattern.meta || getMetadata(pattern.code), [pattern]);
  return (
    <span onClick={onClick} className="mr-4 hover:opacity-50 cursor-pointer">
      {fields.map((field) => (
        <span key={field} className="inline-block mr-2">
          {getField(field, pattern, meta)}
        </span>
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
      {patterns.map((pattern) => {
        const id = pattern.id || 'undefined';
        return (
          <div
            className={classNames(
              id === viewingPatternID && 'bg-selection',
              id === activePattern && started && 'outline outline-1',
              'relative',
            )}
            key={id}
          >
            <PatternButton fields={fields} pattern={pattern} onClick={() => onClick(id)} />
            {(onNewTab || onDuplicate || onDelete) && (
              <PatternActions pattern={pattern} onNewTab={onNewTab} onDuplicate={onDuplicate} onDelete={onDelete} />
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

function SearchInput({ onSearch }) {
  return (
    <form className="flex-grow">
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-2 ps-10 text-sm rounded-md bg-background"
          placeholder="search"
          onChange={onSearch}
        />
      </div>
    </form>
  );
}

const PatternTabUserHeader = ({ onNew, onSearch, patternView }) => {
  return (
    <div className="pr-4 space-x-4 border-b border-foreground flex max-w-full overflow-x-auto pb-1">
      <ActionButton label="new" onClick={onNew} />
      <label className="hover:opacity-50 cursor-pointer leading-9">
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
      <SearchInput onSearch={onSearch} />
      {patternView === 'thumbs' && (
        <ActionButton
          label={<ListViewIcon className="w-4 h-4 mr-2" />}
          onClick={() => settingsMap.setKey('patternView', 'list')}
        />
      )}
      {patternView === 'list' && (
        <ActionButton
          label={<ThumbViewIcon className="w-4 h-4 mr-2" />}
          onClick={() => settingsMap.setKey('patternView', 'thumbs')}
        />
      )}
    </div>
  );
};

const UserPatterns = ({ query, tag = 'title', context }) => {
  const activePattern = useActivePattern();
  const viewingPatternStore = useViewingPatternData();
  const viewingPatternData = parseJSON(viewingPatternStore);
  const viewingPatternID = viewingPatternData?.id;

  const { userPatterns, patternView, autoResetPatternOnChange } = useSettings();

  const q = (query || '').trim();
  const re = new RegExp(q, 'i');
  let filteredPatterns = Object.values(userPatterns);
  if (q) {
    filteredPatterns = filteredPatterns.filter((p) => {
      return p.meta[tag] && p.meta[tag].match(re);
    });
  }
  filteredPatterns = filteredPatterns.reverse();

  const updateCodeWindow = (patternData, reset = false) => {
    context.handleUpdate(patternData, reset);
  };

  const openPattern = (id) => {
    updateCodeWindow(
      {
        ...userPatterns[id],
        collection: userPattern.collection,
      },
      autoResetPatternOnChange,
    );
  };
  const openPatternNewTab = (id) => {
    const url = `?${id}`;
    window.open(url, '_blank').focus();
  };
  const duplicatePattern = (id) => {
    const { data } = userPattern.duplicate(id);
    updateCodeWindow(data);
  };
  const deletePattern = (id) => {
    const { data } = userPattern.delete(id);
    updateCodeWindow({ ...data, collection: userPattern.collection });
  };

  return (
    <>
      {patternView === 'list' && (
        <PatternButtons
          onClick={openPattern}
          onNewTab={openPatternNewTab}
          onDuplicate={duplicatePattern}
          onDelete={deletePattern}
          patterns={filteredPatterns}
          fields={['icon', 'title', 'project', 'actions']}
          started={context.started}
          activePattern={activePattern}
          viewingPatternID={viewingPatternID}
        />
      )}
    </>
  );
};

const UserTags = ({ tag, context }) => {
  const { userPatterns, patternView } = useSettings();
  let userTags = [];
  if (tag) {
    userTags = Object.values(userPatterns).reduce((a, p) => {
      const arr = Array.isArray(p.meta[tag]) ? p.meta[tag] : [p.meta[tag]];
      arr.forEach((v) => {
        if (!a.includes(v)) {
          a = a.concat(v);
        }
      });
      return a;
    }, userTags);
    userTags = userTags.map((t) => {
      return {
        id: t,
        meta: { title: t, type: tag === 'type' ? t : tag },
      };
    });
  } else {
    userTags = Object.values(userPatterns).reduce((a, p) => {
      const newTags = Object.keys(p.meta).filter((k) => {
        return k !== 'title' && !a.includes(k);
      });
      return a.concat(newTags);
    }, userTags);
    userTags = userTags.map((t) => {
      return {
        id: t,
        meta: { title: `${t === 'by' ? 'author' : t}`, type: 'tag' },
      };
    });
  }

  const openTag = (id) => {};
  const deleteTag = () => {};

  return (
    <>
      {patternView === 'list' && (
        <PatternButtons
          onClick={openTag}
          onDelete={deleteTag}
          patterns={userTags}
          fields={['icon', 'title', 'actions']}
          started={context.started}
        />
      )}
    </>
  );
};

export function PatternsTab({ context }) {
  const activePattern = useActivePattern();
  const { patternFilter, patternView, autoResetPatternOnChange } = useSettings();
  const [query, setQuery] = useState('');
  const command = [...query.matchAll(/^(list|)\s*(@[a-z]+)(\s.*)?$/gi)];
  const examplePatterns = useExamplePatterns();
  const collections = examplePatterns.collections;

  const updateCodeWindow = (patternData, reset = false) => {
    context.handleUpdate(patternData, reset);
  };

  const onNew = () => {
    const { data } = userPattern.createAndAddToDB();
    updateCodeWindow(data);
  };

  const onSearch = (ev) => {
    setQuery(ev.target.value);
  };

  return (
    <div className="px-4 w-full dark:text-white text-stone-900 space-y-2 pb-4 flex flex-col overflow-hidden max-h-full">
      <ButtonGroup
        value={patternFilter}
        onChange={(value) => settingsMap.setKey('patternFilter', value)}
        items={patternFilterName}
      ></ButtonGroup>
      {patternFilter === patternFilterName.user && (
        <PatternTabUserHeader onNew={onNew} onSearch={onSearch} patternView={patternView} />
      )}

      <section className="flex overflow-y-scroll max-h-full flex-col">
        {patternFilter === patternFilterName.user && (
          <>
            {command.length === 0 && <UserPatterns query={query} context={context} />}
            {command.length > 0 && !command[0][1] && command[0][2] !== '@tags' && (
              <UserPatterns tag={command[0][2]} query={command[0][3]} context={context} />
            )}
            {command.length > 0 && command[0][1] === 'list' && (
              <UserTags tag={command[0][2].substring(1)} context={context} />
            )}
            {command.length > 0 && command[0][2] === '@tags' && <UserTags context={context} />}
          </>
        )}
        {patternFilter !== patternFilterName.user &&
          Array.from(collections.keys()).map((collection) => {
            const patterns = Object.values(collections.get(collection));
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
