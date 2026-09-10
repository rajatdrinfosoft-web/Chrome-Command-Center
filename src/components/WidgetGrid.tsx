import React from 'react';
import { motion } from 'framer-motion';
import { useWidgetContext } from '../context/WidgetContext';
import { WIDGET_MAP } from '../lib/widgetRegistry';

export const WidgetGrid = () => {
  const { enabledWidgets } = useWidgetContext();

  const coreWidgets = ['bookmarks', 'tabs', 'tasks'];
  const optionalWidgets = enabledWidgets.filter(id => !['clock', 'search', ...coreWidgets].includes(id));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const renderWidget = (id: string) => {
    const WidgetComponent = WIDGET_MAP[id];
    if (!WidgetComponent) return null;
    return (
      <motion.div 
        key={id} 
        variants={itemVariants}
        className="p-6 bg-slate-900/40 border border-cyan-900/30 rounded-2xl backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.05)] ring-1 ring-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 animate-[pulse_4s_ease-in-out_infinite]"
      >
        <WidgetComponent />
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {optionalWidgets.map(renderWidget)}
      </section>
    </motion.div>
  );
};
