import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWidgetContext } from '../context/WidgetContext';
import { WIDGET_MAP } from '../lib/widgetRegistry';
import { useAppStore } from '../stores/appStore';
import { WidgetErrorBoundary } from './WidgetErrorBoundary';

export const WidgetGrid = () => {
  const { enabledWidgets } = useWidgetContext();
  const { vimMode, widgetOrder, setWidgetOrder, reducedMotion, widgetSizes } = useAppStore();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const widgetRefs = useRef<Array<HTMLDivElement | null>>([]);

  const coreWidgets = ['bookmarks', 'tabs', 'tasks'];
  const featuredWidgets = ['pomodoro', 'quickTools'];
  const fallbackOrder = [...coreWidgets, ...enabledWidgets.filter(id => !['clock', 'search', ...coreWidgets].includes(id))];
  const widgetIds = [...new Set([...widgetOrder, ...fallbackOrder])].filter((id) => enabledWidgets.includes(id) && WIDGET_MAP[id]);
  const featuredIds = featuredWidgets.filter((id) => widgetIds.includes(id));
  const optionalWidgets = widgetIds.filter(id => !coreWidgets.includes(id) && !featuredWidgets.includes(id));
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      const direction = event.key === 'ArrowRight' || (vimMode && event.key === 'l') ? 1
        : event.key === 'ArrowLeft' || (vimMode && event.key === 'h') ? -1
        : event.key === 'ArrowDown' || (vimMode && event.key === 'j') ? 1
        : event.key === 'ArrowUp' || (vimMode && event.key === 'k') ? -1 : 0;
      if (!direction || !widgetIds.length) return;
      event.preventDefault();
      setFocusedIndex((currentIndex) => {
        const nextIndex = (currentIndex + direction + widgetIds.length) % widgetIds.length;
        widgetRefs.current[nextIndex]?.focus();
        return nextIndex;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vimMode, widgetIds.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const getWidgetAccent = (id: string) => {
    switch (id) {
      case 'bookmarks':
      case 'analytics':
        return 'coral';
      case 'tasks':
      case 'pomodoro':
      case 'sessionHeatmap':
        return 'emerald';
      case 'tabs':
      case 'tabGroups':
      case 'quickTools':
        return 'amber';
      case 'history':
      case 'sessions':
        return 'purple';
      case 'recentlyClosed':
        return 'rose';
      default:
        return 'cyan';
    }
  };

  const renderWidget = (id: string) => {
    const widgetIndex = widgetIds.indexOf(id);
    const WidgetComponent = WIDGET_MAP[id];
    if (!WidgetComponent) return null;
    const accent = getWidgetAccent(id);
    const size = widgetSizes[id] ?? 'standard';

    return (
      <motion.div
        key={id} 
        ref={(element) => { widgetRefs.current[widgetIndex] = element; }}
        tabIndex={0}
        onFocus={() => setFocusedIndex(widgetIndex)}
        draggable
        onDragStart={() => setDraggedWidget(id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => {
          if (!draggedWidget || draggedWidget === id) return;
          const nextOrder = [...widgetIds];
          const fromIndex = nextOrder.indexOf(draggedWidget);
          const toIndex = nextOrder.indexOf(id);
          nextOrder.splice(fromIndex, 1);
          nextOrder.splice(toIndex, 0, draggedWidget);
          setWidgetOrder(nextOrder);
          setDraggedWidget(null);
        }}
        onDragEnd={() => setDraggedWidget(null)}
        aria-label={`${id} widget`}
        variants={itemVariants}
        data-accent={accent}
        className={`command-widget widget-size-${size} group relative min-h-[160px] rounded-2xl p-5 sm:p-6 text-[var(--page-ink)] transition-all duration-300 shadow-lg ${reducedMotion ? '' : 'command-reveal'} ${reducedMotion ? '' : `command-reveal-delay-${(widgetIndex % 3) + 1}`}`}
      >
        <WidgetErrorBoundary widgetId={id}>
          <WidgetComponent />
        </WidgetErrorBoundary>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="flex flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coreWidgets.map(renderWidget)}
      </section>

      {featuredIds.length > 0 && (
        <section aria-label="Focus and developer tools" className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-transparent p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(40,215,209,0.15)]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-500">Power Tools</h2>
                <p className="text-[11px] text-neutral-500">Accelerated focus & utilities</p>
              </div>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent mx-6 hidden sm:block" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 relative z-10">
            {featuredIds.map(renderWidget)}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {optionalWidgets.map(renderWidget)}
      </section>
    </motion.div>
  );
};
