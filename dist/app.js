/**
 * Screenshot Layout Tool - Bundled Version
 * Structure-driven screenshot layout tool
 */

// ========== EventBus ==========
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this.listeners.get(event);
    if (handlers) handlers.delete(handler);
  }

  emit(event, payload) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try { handler(payload); } catch (e) { console.error(e); }
      });
    }
  }
}

// ========== Utilities ==========
function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ========== Layout Types ==========
/**
 * Layouts are divided into two categories:
 * 1. Linear Layout - Variable number of items, supports unlimited additions
 * 2. Structural Layout - Fixed number of items, each slot has a specific semantic role
 */

const LayoutType = {
  // ===== Linear Layouts =====
  // Variable number of items, all items follow same size and alignment rules, supports unlimited additions
  HORIZONTAL_STACK: 'horizontal-stack',   // Horizontal stack
  VERTICAL_STACK: 'vertical-stack',       // Vertical stack
  
  // ===== Structural Layouts =====
  // Fixed number of items, each slot has specific semantic role, no additions allowed
  
  // -- Focus Layouts --
  LEFT_FOCUS: 'left-focus',               // Left focus: 1 left 2 right, left is main
  RIGHT_FOCUS: 'right-focus',             // Right focus: 2 left 1 right, right is main
  TOP_FOCUS: 'top-focus',                 // Top focus: 1 top 2 bottom, top is main
  BOTTOM_FOCUS: 'bottom-focus',           // Bottom focus: 2 top 1 bottom, bottom is main
  LEFT_FOCUS_4: 'left-focus-4',           // Left focus 4 images
  RIGHT_FOCUS_4: 'right-focus-4',         // Right focus 4 images
  CENTER_FOCUS_5: 'center-focus-5',       // Center focus 5 images
  TOP_FOCUS_5: 'top-focus-5',             // Top focus 5 images
  
  // -- Grid Layouts --
  GRID_2X2: 'grid-2x2',                   // 2x2 grid
  GRID_3X3: 'grid-3x3',                   // 3x3 grid
  GRID_2X3: 'grid-2x3',                   // 2 rows 3 columns
  
  // -- Comparison Layouts --
  BEFORE_AFTER: 'before-after',           // Before/after (horizontal)
  BEFORE_AFTER_V: 'before-after-v',       // Before/after (vertical)
  
  // -- Frame Layouts --
  BROWSER: 'browser',                     // Browser frame
  PHONE: 'phone',                         // Phone frame
};

const LAYOUT_DEFINITIONS = {
  // ========================================
  // LINEAR LAYOUTS
  // Feature: Variable number of items, supports unlimited additions
  // ========================================
  
  [LayoutType.HORIZONTAL_STACK]: {
    type: LayoutType.HORIZONTAL_STACK,
    name: 'Horizontal Stack',
    nameCN: 'Horizontal Stack',
    category: 'linear',
    layoutLogic: 'linear',      // Linear logic
    isLinear: true,
    initialSlots: 2,
    maxSlots: null,             // Unlimited
    direction: 'row',
    slotConfig: {
      equalSize: true,          // All items equal width
      minSize: 100,             // Minimum width
      imageFit: 'contain',      // Image fit mode
      imagePosition: 'center',  // Image centered
    },
    css: { display: 'flex', flexDirection: 'row', gap: '12px' }
  },
  
  [LayoutType.VERTICAL_STACK]: {
    type: LayoutType.VERTICAL_STACK,
    name: 'Vertical Stack',
    nameCN: 'Vertical Stack',
    category: 'linear',
    layoutLogic: 'linear',
    isLinear: true,
    initialSlots: 2,
    maxSlots: null,
    direction: 'column',
    slotConfig: {
      equalSize: true,
      minSize: 80,
      imageFit: 'contain',
      imagePosition: 'center',
    },
    css: { display: 'flex', flexDirection: 'column', gap: '12px' }
  },

  // ========================================
  // STRUCTURAL LAYOUTS
  // Feature: Fixed number of items, each slot has specific semantic role
  // ========================================
  
  // ----- Focus Layouts -----
  
  [LayoutType.LEFT_FOCUS]: {
    type: LayoutType.LEFT_FOCUS,
    name: 'Left Focus',
    nameCN: 'Left Focus',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 3,
    maxSlots: 3,
    slots: [
      { id: 0, role: 'primary', name: 'Main', sizeRatio: '1fr', gridArea: '1 / 1 / 3 / 2' },
      { id: 1, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr', gridArea: '1 / 2 / 2 / 3' },
      { id: 2, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr', gridArea: '2 / 2 / 3 / 3' },
    ],
    primarySlot: 0,             // Visual primary position
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1 / 3', gridColumn: '1' },
      1: { gridRow: '1', gridColumn: '2' },
      2: { gridRow: '2', gridColumn: '2' }
    },
    slotConfig: {
      imageFit: 'cover',        // Image crop fill
      imagePosition: 'center',
    }
  },
  
  [LayoutType.RIGHT_FOCUS]: {
    type: LayoutType.RIGHT_FOCUS,
    name: 'Right Focus',
    nameCN: 'Right Focus',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 3,
    maxSlots: 3,
    slots: [
      { id: 0, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr', gridArea: '1 / 1 / 2 / 2' },
      { id: 1, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr', gridArea: '2 / 1 / 3 / 2' },
      { id: 2, role: 'primary', name: 'Main', sizeRatio: '1fr', gridArea: '1 / 2 / 3 / 3' },
    ],
    primarySlot: 2,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1', gridColumn: '1' },
      1: { gridRow: '2', gridColumn: '1' },
      2: { gridRow: '1 / 3', gridColumn: '2' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  [LayoutType.TOP_FOCUS]: {
    type: LayoutType.TOP_FOCUS,
    name: 'Top Focus',
    nameCN: 'Top Focus',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 3,
    maxSlots: 3,
    slots: [
      { id: 0, role: 'primary', name: 'Main', sizeRatio: '2fr' },
      { id: 1, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr' },
      { id: 2, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr' },
    ],
    primarySlot: 0,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '2fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1', gridColumn: '1 / 3' },
      1: { gridRow: '2', gridColumn: '1' },
      2: { gridRow: '2', gridColumn: '2' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  [LayoutType.BOTTOM_FOCUS]: {
    type: LayoutType.BOTTOM_FOCUS,
    name: 'Bottom Focus',
    nameCN: 'Bottom Focus',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 3,
    maxSlots: 3,
    slots: [
      { id: 0, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr' },
      { id: 1, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr' },
      { id: 2, role: 'primary', name: 'Main', sizeRatio: '2fr' },
    ],
    primarySlot: 2,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 2fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1', gridColumn: '1' },
      1: { gridRow: '1', gridColumn: '2' },
      2: { gridRow: '2', gridColumn: '1 / 3' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  // ----- Grid Layouts -----
  
  [LayoutType.GRID_2X2]: {
    type: LayoutType.GRID_2X2,
    name: '2×2 Grid',
    nameCN: '2x2 Grid',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 4,
    maxSlots: 4,
    slots: [
      { id: 0, role: 'equal', name: 'Image 1', sizeRatio: '1fr' },
      { id: 1, role: 'equal', name: 'Image 2', sizeRatio: '1fr' },
      { id: 2, role: 'equal', name: 'Image 3', sizeRatio: '1fr' },
      { id: 3, role: 'equal', name: 'Image 4', sizeRatio: '1fr' },
    ],
    primarySlot: null,          // No primary, all equal weight
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  [LayoutType.GRID_3X3]: {
    type: LayoutType.GRID_3X3,
    name: '3×3 Grid',
    nameCN: '3x3 Grid',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 9,
    maxSlots: 9,
    slots: Array.from({ length: 9 }, (_, i) => ({ id: i, role: 'equal', name: `Image ${i + 1}`, sizeRatio: '1fr' })),
    primarySlot: null,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: '12px' },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  [LayoutType.GRID_2X3]: {
    type: LayoutType.GRID_2X3,
    name: '2×3 Grid',
    nameCN: '2x3 Grid',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 6,
    maxSlots: 6,
    slots: Array.from({ length: 6 }, (_, i) => ({ id: i, role: 'equal', name: `Image ${i + 1}`, sizeRatio: '1fr' })),
    primarySlot: null,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  // ----- Comparison Layouts -----
  
  [LayoutType.BEFORE_AFTER]: {
    type: LayoutType.BEFORE_AFTER,
    name: 'Before / After',
    nameCN: 'Before / After',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 2,
    maxSlots: 2,
    slots: [
      { id: 0, role: 'before', name: 'Before', sizeRatio: '1fr', label: 'BEFORE' },
      { id: 1, role: 'after', name: 'After', sizeRatio: '1fr', label: 'AFTER' },
    ],
    primarySlot: null,          // Both equal weight
    showLabels: true,           // Show labels
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr', gap: '12px' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },
  
  [LayoutType.BEFORE_AFTER_V]: {
    type: LayoutType.BEFORE_AFTER_V,
    name: 'Before / After (Vertical)',
    nameCN: 'Before / After (Vertical)',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 2,
    maxSlots: 2,
    slots: [
      { id: 0, role: 'before', name: 'Before', sizeRatio: '1fr', label: 'BEFORE' },
      { id: 1, role: 'after', name: 'After', sizeRatio: '1fr', label: 'AFTER' },
    ],
    primarySlot: null,
    showLabels: true,
    css: { display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },
  
  // ----- Frame Layouts -----
  
  [LayoutType.BROWSER]: {
    type: LayoutType.BROWSER,
    name: 'Browser Frame',
    nameCN: 'Browser Frame',
    category: 'frame',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 1,
    maxSlots: 1,
    hasFrame: true,
    frameType: 'browser',
    slots: [{ id: 0, role: 'content', name: 'Content', sizeRatio: '1fr' }],
    primarySlot: 0,
    css: { display: 'flex', flexDirection: 'column' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },
  
  [LayoutType.PHONE]: {
    type: LayoutType.PHONE,
    name: 'Phone Frame',
    nameCN: 'Phone Frame',
    category: 'frame',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 1,
    maxSlots: 1,
    hasFrame: true,
    frameType: 'phone',
    slots: [{ id: 0, role: 'content', name: 'Content', sizeRatio: '1fr' }],
    primarySlot: 0,
    css: { display: 'flex', flexDirection: 'column' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },
  
  // Tablet Frame
  'tablet': {
    type: 'tablet',
    name: 'Tablet Frame',
    nameCN: 'Tablet Frame',
    category: 'frame',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 1,
    maxSlots: 1,
    hasFrame: true,
    frameType: 'tablet',
    slots: [{ id: 0, role: 'content', name: 'Content', sizeRatio: '1fr' }],
    primarySlot: 0,
    css: { display: 'flex', flexDirection: 'column' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },
  
  // 1x3 Grid
  'grid-1x3': {
    type: 'grid-1x3',
    name: '1×3 Grid',
    nameCN: '1x3 Grid',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 3,
    maxSlots: 3,
    slots: Array.from({ length: 3 }, (_, i) => ({ id: i, role: 'equal', name: `Image ${i + 1}`, sizeRatio: '1fr' })),
    primarySlot: null,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr', gap: '12px' },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },
  
  // Triple Compare
  'triple-compare': {
    type: 'triple-compare',
    name: 'Triple Compare',
    nameCN: 'Triple Compare',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 3,
    maxSlots: 3,
    slots: [
      { id: 0, role: 'compare', name: 'Compare 1', sizeRatio: '1fr', label: '1' },
      { id: 1, role: 'compare', name: 'Compare 2', sizeRatio: '1fr', label: '2' },
      { id: 2, role: 'compare', name: 'Compare 3', sizeRatio: '1fr', label: '3' },
    ],
    primarySlot: null,
    showLabels: true,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr', gap: '12px' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },
  
  // Quad Compare
  'quad-compare': {
    type: 'quad-compare',
    name: 'Quad Compare',
    nameCN: 'Quad Compare',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 4,
    maxSlots: 4,
    slots: [
      { id: 0, role: 'compare', name: 'Compare 1', sizeRatio: '1fr', label: '1' },
      { id: 1, role: 'compare', name: 'Compare 2', sizeRatio: '1fr', label: '2' },
      { id: 2, role: 'compare', name: 'Compare 3', sizeRatio: '1fr', label: '3' },
      { id: 3, role: 'compare', name: 'Compare 4', sizeRatio: '1fr', label: '4' },
    ],
    primarySlot: null,
    showLabels: true,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotConfig: { imageFit: 'contain', imagePosition: 'center' }
  },

  // ========== Additional Focus Layouts ==========
  
  // Left Focus 4
  'left-focus-4': {
    type: 'left-focus-4',
    name: 'Left Focus 4',
    nameCN: 'Left Focus 4',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 4,
    maxSlots: 4,
    slots: [
      { id: 0, role: 'primary', name: 'Main', sizeRatio: '2fr', gridArea: '1 / 1 / 4 / 2' },
      { id: 1, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr', gridArea: '1 / 2 / 2 / 3' },
      { id: 2, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr', gridArea: '2 / 2 / 3 / 3' },
      { id: 3, role: 'secondary', name: 'Sub 3', sizeRatio: '1fr', gridArea: '3 / 2 / 4 / 3' },
    ],
    primarySlot: 0,
    css: { display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1 / 4', gridColumn: '1' },
      1: { gridRow: '1', gridColumn: '2' },
      2: { gridRow: '2', gridColumn: '2' },
      3: { gridRow: '3', gridColumn: '2' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },

  // Right Focus 4
  'right-focus-4': {
    type: 'right-focus-4',
    name: 'Right Focus 4',
    nameCN: 'Right Focus 4',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 4,
    maxSlots: 4,
    slots: [
      { id: 0, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr', gridArea: '1 / 1 / 2 / 2' },
      { id: 1, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr', gridArea: '2 / 1 / 3 / 2' },
      { id: 2, role: 'secondary', name: 'Sub 3', sizeRatio: '1fr', gridArea: '3 / 1 / 4 / 2' },
      { id: 3, role: 'primary', name: 'Main', sizeRatio: '2fr', gridArea: '1 / 2 / 4 / 3' },
    ],
    primarySlot: 3,
    css: { display: 'grid', gridTemplateColumns: '1fr 2fr', gridTemplateRows: '1fr 1fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1', gridColumn: '1' },
      1: { gridRow: '2', gridColumn: '1' },
      2: { gridRow: '3', gridColumn: '1' },
      3: { gridRow: '1 / 4', gridColumn: '2' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },

  // Center Focus 5
  'center-focus-5': {
    type: 'center-focus-5',
    name: 'Center Focus 5',
    nameCN: 'Center Focus 5',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 5,
    maxSlots: 5,
    slots: [
      { id: 0, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr' },
      { id: 1, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr' },
      { id: 2, role: 'primary', name: 'Main', sizeRatio: '1.5fr' },
      { id: 3, role: 'secondary', name: 'Sub 3', sizeRatio: '1fr' },
      { id: 4, role: 'secondary', name: 'Sub 4', sizeRatio: '1fr' },
    ],
    primarySlot: 2,
    css: { display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1', gridColumn: '1' },
      1: { gridRow: '2', gridColumn: '1' },
      2: { gridRow: '1 / 3', gridColumn: '2' },
      3: { gridRow: '1', gridColumn: '3' },
      4: { gridRow: '2', gridColumn: '3' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  },

  // Top Focus 5
  'top-focus-5': {
    type: 'top-focus-5',
    name: 'Top Focus 5',
    nameCN: 'Top Focus 5',
    category: 'structural',
    layoutLogic: 'structural',
    isLinear: false,
    initialSlots: 5,
    maxSlots: 5,
    slots: [
      { id: 0, role: 'primary', name: 'Main', sizeRatio: '2fr' },
      { id: 1, role: 'secondary', name: 'Sub 1', sizeRatio: '1fr' },
      { id: 2, role: 'secondary', name: 'Sub 2', sizeRatio: '1fr' },
      { id: 3, role: 'secondary', name: 'Sub 3', sizeRatio: '1fr' },
      { id: 4, role: 'secondary', name: 'Sub 4', sizeRatio: '1fr' },
    ],
    primarySlot: 0,
    css: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '2fr 1fr', gap: '12px' },
    slotStyles: {
      0: { gridRow: '1', gridColumn: '1 / 5' },
      1: { gridRow: '2', gridColumn: '1' },
      2: { gridRow: '2', gridColumn: '2' },
      3: { gridRow: '2', gridColumn: '3' },
      4: { gridRow: '2', gridColumn: '4' }
    },
    slotConfig: { imageFit: 'cover', imagePosition: 'center' }
  }
};

function getLayoutDefinition(type) {
  return LAYOUT_DEFINITIONS[type] || null;
}


// ========== StateManager ==========
const INITIAL_STATE = {
  meta: { userId: null, sessionId: generateId(), createdAt: Date.now(), updatedAt: Date.now() },
  layoutTree: null,
  selectedContainerId: null,
  properties: { padding: 24, gap: 12, roundness: 12, scaleMode: 'uniform', linearAlign: 'center' },
  zoom: 1.0
};

class StateManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.state = deepClone(INITIAL_STATE);
    this.subscribers = new Set();
    this.history = [deepClone(this.state)];
    this.historyIndex = 0;
  }

  getState() { return deepClone(this.state); }

  setState(partial, recordHistory = true) {
    const newState = { ...deepClone(this.state), ...partial, meta: { ...this.state.meta, updatedAt: Date.now() } };
    this.state = newState;
    if (recordHistory) this._pushHistory(newState);
    this._notifySubscribers();
    this.eventBus.emit('state:change', this.getState());
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  setLayoutTree(layoutTree) { this.setState({ layoutTree: deepClone(layoutTree) }); }

  updateLayoutTree(updater) {
    const newTree = updater(deepClone(this.state.layoutTree));
    this.setState({ layoutTree: newTree });
  }

  setSelectedContainer(containerId) { this.setState({ selectedContainerId: containerId }, false); }
  setProperty(key, value) { this.setState({ properties: { ...this.state.properties, [key]: value } }); }
  setZoom(zoom) { this.setState({ zoom }, false); }

  _notifySubscribers() {
    const state = this.getState();
    this.subscribers.forEach(listener => { try { listener(state); } catch (e) { console.error(e); } });
  }

  _pushHistory(state) {
    if (this.historyIndex < this.history.length - 1) this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(deepClone(state));
    this.historyIndex = this.history.length - 1;
    if (this.history.length > 50) { this.history.shift(); this.historyIndex--; }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = deepClone(this.history[this.historyIndex]);
      this._notifySubscribers();
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = deepClone(this.history[this.historyIndex]);
      this._notifySubscribers();
      return true;
    }
    return false;
  }
}

// ========== LayoutSystem ==========
class LayoutSystem {
  constructor(stateManager) { this.stateManager = stateManager; }

  createLayout(type) {
    const definition = getLayoutDefinition(type);
    if (!definition) return null;

    const slots = [];
    for (let i = 0; i < definition.initialSlots; i++) {
      slots.push({ id: generateId(), index: i, image: null });
    }

    const layoutNode = {
      id: generateId(),
      type: type,
      definition: { ...definition },
      containers: [{ id: generateId(), slots: slots }]
    };

    this.stateManager.setLayoutTree(layoutNode);
    return layoutNode;
  }

  canAddSlot(layoutId) {
    const state = this.stateManager.getState();
    const layout = state.layoutTree;
    if (!layout || layout.id !== layoutId) return false;
    if (!layout.definition.isLinear) return false;
    if (layout.definition.maxSlots !== null) {
      return layout.containers[0]?.slots.length < layout.definition.maxSlots;
    }
    return true;
  }

  addSlot(layoutId) {
    if (!this.canAddSlot(layoutId)) return false;
    this.stateManager.updateLayoutTree((layout) => {
      if (!layout || layout.id !== layoutId) return layout;
      const container = layout.containers[0];
      if (container) {
        container.slots.push({ id: generateId(), index: container.slots.length, image: null });
      }
      return layout;
    });
    return true;
  }
}

// ========== ContainerSystem ==========
class ContainerSystem {
  constructor(stateManager) { this.stateManager = stateManager; }

  selectContainer(containerId) { this.stateManager.setSelectedContainer(containerId); }
  
  deleteContainer(containerId) {
    const state = this.stateManager.getState();
    if (!state.layoutTree) return;
    if (state.layoutTree.containers.length <= 1) {
      this.stateManager.setLayoutTree(null);
      this.stateManager.setSelectedContainer(null);
      return;
    }
    this.stateManager.updateLayoutTree((layout) => {
      layout.containers = layout.containers.filter(c => c.id !== containerId);
      return layout;
    });
  }
}


// ========== ImageHandler ==========
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

class ImageHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.fileInput = null;
    this.pendingSlotId = null;
    this._createFileInput();
  }

  _createFileInput() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = ACCEPTED_TYPES.join(',');
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', (e) => this._handleFileSelect(e));
    document.body.appendChild(this.fileInput);
  }

  openFilePicker(slotId) {
    this.pendingSlotId = slotId;
    this.fileInput.click();
  }

  async _handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (file && this.pendingSlotId) await this.uploadToSlot(this.pendingSlotId, file);
    this.fileInput.value = '';
    this.pendingSlotId = null;
  }

  async uploadToSlot(slotId, file) {
    if (!ACCEPTED_TYPES.includes(file.type)) { showToast('Only PNG, JPG, WebP formats supported', 'error'); return false; }
    if (file.size > MAX_FILE_SIZE) { showToast('File size cannot exceed 10MB', 'error'); return false; }

    try {
      const imageData = await this._readImageFile(file);
      this.stateManager.updateLayoutTree((layout) => {
        if (!layout) return layout;
        for (const container of layout.containers) {
          const slot = container.slots.find(s => s.id === slotId);
          if (slot) { slot.image = imageData; break; }
        }
        return layout;
      });
      return true;
    } catch (error) {
      showToast('Image loading failed', 'error');
      return false;
    }
  }

  removeFromSlot(slotId) {
    this.stateManager.updateLayoutTree((layout) => {
      if (!layout) return layout;
      for (const container of layout.containers) {
        const slot = container.slots.find(s => s.id === slotId);
        if (slot) {
          if (slot.image?.src?.startsWith('blob:')) URL.revokeObjectURL(slot.image.src);
          slot.image = null;
          break;
        }
      }
      return layout;
    });
  }

  async handleDrop(slotId, dataTransfer) {
    if (dataTransfer.files.length > 0) await this.uploadToSlot(slotId, dataTransfer.files[0]);
  }

  async _readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ id: generateId(), src: URL.createObjectURL(file), originalName: file.name, width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// ========== CanvasRenderer ==========
class CanvasRenderer {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.canvasRoot = null;
    this.canvasContent = null;
    this.mainArea = null;
    this.currentZoom = 1;
  }

  init() {
    this.canvasRoot = document.getElementById('canvas-root');
    this.canvasContent = document.getElementById('canvas-content');
    this.mainArea = document.getElementById('canvas-area');
  }

  render(state) {
    if (!this.canvasContent) this.init();
    if (!this.canvasContent) return;

    const { layoutTree, properties } = state;
    this.canvasContent.innerHTML = '';

    if (!layoutTree) {
      this.canvasContent.style.padding = '60px';
      this.canvasContent.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;flex:1;width:100%;height:100%;color:#86868b;font-size:28px;font-weight:600;"><span>Select a layout to start</span></div>';
      this.canvasRoot.style.minWidth = '400px';
      this.canvasRoot.style.minHeight = '300px';
      return;
    }

    // Apply properties - use 0 if explicitly set to 0
    const padding = properties.padding !== undefined ? properties.padding : 24;
    const gap = properties.gap !== undefined ? properties.gap : 12;
    const roundness = properties.roundness !== undefined ? properties.roundness : 12;
    
    // All layouts use the same content constraints
    this.canvasContent.style.padding = `${padding}px`;
    this.canvasContent.style.gap = `${gap}px`;
    this.canvasContent.style.boxSizing = 'border-box';
    this.canvasContent.style.height = '100%';
    this.canvasContent.style.overflow = 'hidden';
    this.canvasRoot.style.borderRadius = `${roundness}px`;

    // Render layout
    const layoutElement = this._renderLayout(layoutTree, gap, roundness);
    this.canvasContent.appendChild(layoutElement);
    
    // Auto-adjust canvas size
    this._adjustCanvasSize(layoutTree);
    this.setZoom(state.zoom);
  }

  _adjustCanvasSize(layout) {
    const definition = layout.definition || getLayoutDefinition(layout.type);
    
    // All layouts use fixed canvas size for consistent display
    this.canvasRoot.style.width = '900px';
    this.canvasRoot.style.height = '560px';
    this.canvasRoot.style.minWidth = '600px';
    this.canvasRoot.style.minHeight = '400px';
    this.canvasRoot.style.overflow = 'hidden';
  }

  _renderLayout(layout, gap, roundness) {
    const definition = layout.definition || getLayoutDefinition(layout.type);
    const wrapper = document.createElement('div');
    
    // Linear layout: horizontal or vertical stack
    const isHorizontal = definition.direction === 'row';
    const isLinear = definition.layoutLogic === 'linear';
    
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = isHorizontal ? 'row' : 'column';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';  // All layouts use 100% height
    wrapper.style.gap = `${gap}px`;
    wrapper.style.overflow = definition.hasFrame ? 'visible' : 'hidden';

    if (definition.hasFrame) {
      const frameEl = this._renderFrame(layout, definition, roundness);
      frameEl.style.flex = '1';
      frameEl.style.minHeight = '0';
      wrapper.appendChild(frameEl);
    } else {
      const containerEl = this._renderContainer(layout.containers[0], definition, gap, roundness, isLinear);
      // All layouts use the same container constraints
      containerEl.style.flex = '1';
      containerEl.style.minHeight = '0';
      containerEl.style.overflow = 'hidden';
      wrapper.appendChild(containerEl);
    }

    // Linear layout shows add button
    if (definition.layoutLogic === 'linear') {
      const addBtn = document.createElement('button');
      addBtn.className = 'add-slot-btn';
      addBtn.dataset.action = 'add-slot';
      addBtn.dataset.layoutId = layout.id;
      addBtn.dataset.noExport = 'true';
      
      if (isHorizontal) {
        addBtn.style.cssText = 'width:44px;min-width:44px;border:1.5px dashed #aeaeb2;border-radius:6px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#aeaeb2;transition:background-color 0.15s ease;flex-shrink:0;';
      } else {
        addBtn.style.cssText = 'width:100%;height:44px;min-height:44px;border:1.5px dashed #aeaeb2;border-radius:6px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#aeaeb2;transition:background-color 0.15s ease;flex-shrink:0;';
      }
      
      addBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">add</span>';
      addBtn.onmouseover = () => { addBtn.style.backgroundColor = 'rgba(0,0,0,0.04)'; addBtn.style.borderColor = '#aeaeb2'; };
      addBtn.onmouseout = () => { addBtn.style.backgroundColor = 'transparent'; };
      wrapper.appendChild(addBtn);
    }

    return wrapper;
  }

  _renderContainer(container, definition, gap, roundness, isLinear = false) {
    const element = document.createElement('div');
    element.dataset.containerId = container.id;
    
    // Apply layout styles
    const css = { ...definition.css };
    css.gap = `${gap}px`;
    Object.assign(element.style, css);
    element.style.width = '100%';
    element.style.height = '100%';  // All layouts use 100% height

    container.slots.forEach((slot, index) => {
      element.appendChild(this._renderSlot(slot, definition, index, roundness, isLinear));
    });

    return element;
  }

  _renderSlot(slot, definition, index, roundness, isLinear = false) {
    const element = document.createElement('div');
    element.dataset.slotId = slot.id;
    // Mark empty slots for export filtering
    if (!slot.image) {
      element.dataset.emptySlot = 'true';
    }
    const overflowStyle = 'hidden';
    
    // Linear layouts use flex:1 to evenly distribute space
    const isVerticalLinear = isLinear && definition.direction === 'column';
    const isHorizontalLinear = isLinear && definition.direction === 'row';
    
    if (isVerticalLinear) {
      // Vertical: flex:1 for equal height distribution, full width
      element.style.cssText = `flex:1;width:100%;min-height:0;overflow:${overflowStyle};display:flex;align-items:center;justify-content:center;border-radius:${roundness}px;position:relative;`;
    } else if (isHorizontalLinear) {
      // Horizontal: flex:1 for equal width distribution
      element.style.cssText = `flex:1;min-width:80px;min-height:0;height:100%;overflow:${overflowStyle};display:flex;align-items:center;justify-content:center;border-radius:${roundness}px;position:relative;`;
    } else {
      // Other layouts: flex:1 with min-height
      element.style.cssText = `flex:1;min-width:0;min-height:120px;overflow:${overflowStyle};display:flex;align-items:center;justify-content:center;border-radius:${roundness}px;position:relative;`;
    }

    if (definition.slotStyles && definition.slotStyles[index]) {
      Object.assign(element.style, definition.slotStyles[index]);
    }

    // Compare layout background color
    const isCompare = definition.type?.includes('compare') || definition.type === 'before-after' || definition.type === 'before-after-v';
    const compareColors = {
      0: '#fef8e0',
      1: '#fef0d8',
      2: '#fee4d5',
      3: '#fdd5d5'
    };

    if (slot.image) {
      // All layouts with images use the same background
      element.style.background = isCompare ? compareColors[index] || '#f5f5f7' : '#f5f5f7';
      // All linear layouts use the same image style: maintain aspect ratio, fit within slot
      element.innerHTML = `
        <img src="${slot.image.src}" alt="" style="max-width:100%;max-height:100%;width:auto;height:auto;display:block;" />
        <button data-action="delete-slot" data-no-export="true" style="position:absolute;top:8px;right:8px;width:24px;height:24px;border:none;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.15s ease;">
          <span class="material-symbols-outlined" style="font-size:14px;">close</span>
        </button>
      `;
      element.onmouseover = () => element.querySelector('button').style.opacity = '1';
      element.onmouseout = () => element.querySelector('button').style.opacity = '0';
    } else {
      if (isCompare) {
        element.style.background = compareColors[index] || '#f5f5f7';
        element.style.border = '1px solid #d1d1d6';
      } else {
        element.style.background = '#f5f5f7';
        element.style.border = '1.5px dashed #d1d1d6';
      }
      element.style.cursor = 'pointer';
      element.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;color:#aeaeb2;">
          <span class="material-symbols-outlined" style="font-size:28px;">add_photo_alternate</span>
          <span style="font-size:11px;font-weight:500;">Click to upload</span>
        </div>
      `;
    }

    return element;
  }

  _renderFrame(layout, definition, roundness) {
    const container = layout.containers[0];
    const slot = container.slots[0];

    // Browser Frame - remove overflow limit, frame size determined by content
    if (definition.frameType === 'browser') {
      const frame = document.createElement('div');
      frame.dataset.containerId = container.id;
      frame.style.cssText = `border-radius:${roundness}px;border:1px solid #e5e7eb;background:#fff;display:flex;flex-direction:column;height:100%;overflow:visible;`;
      frame.dataset.frameExport = 'true';
      frame.innerHTML = `
        <div style="height:32px;background:#f3f4f6;display:flex;align-items:center;padding:0 12px;gap:6px;border-bottom:1px solid #e5e7eb;flex-shrink:0;">
          <div style="width:10px;height:10px;border-radius:50%;background:#FF5F57;"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#FEBC2E;"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#28C840;"></div>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:visible;" data-slot-id="${slot.id}">
          ${slot.image ? `<img src="${slot.image.src}" style="max-width:100%;max-height:100%;object-fit:contain;display:block;" /><button data-action="delete-slot" data-no-export="true" style="position:absolute;top:8px;right:8px;width:24px;height:24px;border:none;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.15s ease;"><span class="material-symbols-outlined" style="font-size:14px;">close</span></button>` : '<div style="padding:40px;text-align:center;color:#9ca3af;"><span class="material-symbols-outlined" style="font-size:32px;">add_photo_alternate</span><div style="margin-top:8px;font-size:12px;">Click to upload</div></div>'}
        </div>
      `;
      const slotEl = frame.querySelector('[data-slot-id]');
      if (slot.image && slotEl) {
        slotEl.onmouseover = () => { const btn = slotEl.querySelector('button'); if (btn) btn.style.opacity = '1'; };
        slotEl.onmouseout = () => { const btn = slotEl.querySelector('button'); if (btn) btn.style.opacity = '0'; };
      }
      return frame;
    }

    // Phone Frame - remove max limit, frame size determined by content
    if (definition.frameType === 'phone') {
      const frame = document.createElement('div');
      frame.dataset.containerId = container.id;
      frame.style.cssText = `display:flex;justify-content:center;align-items:center;width:100%;height:100%;overflow:visible;`;
      
      frame.innerHTML = `
        <div data-frame-export="true" style="height:calc(100% - 20px);aspect-ratio:9/19.5;background:#1a1a1a;border-radius:36px;padding:8px;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.3);overflow:visible;">
          <div style="height:24px;display:flex;justify-content:center;align-items:center;flex-shrink:0;">
            <div style="width:60px;height:5px;background:#333;border-radius:3px;"></div>
          </div>
          <div style="flex:1;background:#fff;border-radius:28px;overflow:visible;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;" data-slot-id="${slot.id}">
            ${slot.image ? `<img src="${slot.image.src}" style="max-width:100%;max-height:100%;object-fit:contain;display:block;" /><button data-action="delete-slot" data-no-export="true" style="position:absolute;top:8px;right:8px;width:24px;height:24px;border:none;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.15s ease;"><span class="material-symbols-outlined" style="font-size:14px;">close</span></button>` : '<div style="padding:20px;text-align:center;color:#9ca3af;"><span class="material-symbols-outlined" style="font-size:28px;">add_photo_alternate</span><div style="margin-top:6px;font-size:11px;">Click to upload</div></div>'}
          </div>
          <div style="height:16px;flex-shrink:0;"></div>
        </div>
      `;
      const slotEl = frame.querySelector('[data-slot-id]');
      if (slot.image && slotEl) {
        slotEl.onmouseover = () => { const btn = slotEl.querySelector('button'); if (btn) btn.style.opacity = '1'; };
        slotEl.onmouseout = () => { const btn = slotEl.querySelector('button'); if (btn) btn.style.opacity = '0'; };
      }
      return frame;
    }

    // Tablet Frame - remove max limit, frame size determined by content
    if (definition.frameType === 'tablet') {
      const frame = document.createElement('div');
      frame.dataset.containerId = container.id;
      frame.style.cssText = `display:flex;justify-content:center;align-items:center;width:100%;height:100%;overflow:visible;`;
      
      frame.innerHTML = `
        <div data-frame-export="true" style="width:calc(100% - 40px);height:calc(100% - 40px);background:#1a1a1a;border-radius:20px;padding:10px;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.3);overflow:visible;">
          <div style="flex:1;background:#fff;border-radius:12px;overflow:visible;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;" data-slot-id="${slot.id}">
            ${slot.image ? `<img src="${slot.image.src}" style="max-width:100%;max-height:100%;object-fit:contain;display:block;" /><button data-action="delete-slot" data-no-export="true" style="position:absolute;top:8px;right:8px;width:24px;height:24px;border:none;border-radius:50%;background:rgba(0,0,0,0.5);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.15s ease;"><span class="material-symbols-outlined" style="font-size:14px;">close</span></button>` : '<div style="padding:40px;text-align:center;color:#9ca3af;"><span class="material-symbols-outlined" style="font-size:32px;">add_photo_alternate</span><div style="margin-top:8px;font-size:12px;">Click to upload</div></div>'}
          </div>
        </div>
      `;
      const slotEl = frame.querySelector('[data-slot-id]');
      if (slot.image && slotEl) {
        slotEl.onmouseover = () => { const btn = slotEl.querySelector('button'); if (btn) btn.style.opacity = '1'; };
        slotEl.onmouseout = () => { const btn = slotEl.querySelector('button'); if (btn) btn.style.opacity = '0'; };
      }
      return frame;
    }

    return this._renderContainer(container, definition, 8, roundness);
  }

  setZoom(zoom) {
    this.currentZoom = zoom;
    // Zoom handled by bindCanvasPanning, only update display here
    const zoomDisplay = document.querySelector('[data-display="zoom"]');
    if (zoomDisplay) zoomDisplay.textContent = `${Math.round(zoom * 100)}%`;
  }

  getCanvasElement() { return this.canvasRoot; }
  getContentElement() { return this.canvasContent; }
}

// ========== ExportSystem ==========
class ExportSystem {
  constructor(canvasRenderer) {
    this.canvasRenderer = canvasRenderer;
    this.html2canvasLoaded = false;
  }

  async _loadHtml2Canvas() {
    if (window.html2canvas) { this.html2canvasLoaded = true; return; }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => { this.html2canvasLoaded = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Get layout info and original image data
  _getLayoutData() {
    const state = window.app?.stateManager?.getState();
    if (!state?.layoutTree) return null;
    
    const layout = state.layoutTree;
    const definition = layout.definition;
    const properties = state.properties || {};
    // Use ?? instead of || to handle 0 values correctly
    const gap = properties.gap !== undefined ? properties.gap : 12;
    const padding = properties.padding !== undefined ? properties.padding : 24;
    
    // Collect all original image data
    const images = [];
    for (const container of layout.containers) {
      for (const slot of container.slots) {
        if (slot.image) {
          images.push({
            slotId: slot.id,
            src: slot.image.src,
            width: slot.image.width,   // Original width
            height: slot.image.height  // Original height
          });
        }
      }
    }
    
    return {
      layoutType: layout.type,
      definition,
      images,
      gap,
      padding,
      direction: definition?.direction || 'row',
      isLinear: definition?.layoutLogic === 'linear',
      isFrame: definition?.hasFrame || false,
      frameType: definition?.frameType,
      scaleMode: properties.scaleMode || 'uniform',
      align: properties.linearAlign || 'center'
    };
  }

  // Load image as Image object
  async _loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // Canvas API export: use original image pixels directly, not dependent on DOM
  async _exportWithCanvas() {
    const layoutData = this._getLayoutData();
    if (!layoutData || layoutData.images.length === 0) {
      throw new Error('No images to export');
    }

    // Get canvas background color
    const canvasRoot = this.canvasRenderer.getCanvasElement();
    const computedStyle = window.getComputedStyle(canvasRoot);
    const bgColor = canvasRoot.style.background || computedStyle.backgroundColor || '#ffffff';

    // Load all original images
    const loadedImages = await Promise.all(
      layoutData.images.map(async (imgData) => {
        const img = await this._loadImage(imgData.src);
        return { ...imgData, img };
      })
    );

    // Calculate export size and draw based on layout type
    if (layoutData.isLinear) {
      // Linear layouts always use Uniform mode: equal height (horizontal) or equal width (vertical)
      return this._exportLinearCanvasUniform(loadedImages, layoutData, bgColor);
    } else if (layoutData.isFrame) {
      return this._exportFrameCanvas(loadedImages, layoutData, bgColor);
    } else {
      // Other layouts use html2canvas
      return this._exportWithHtml2Canvas();
    }
  }

  // Detect image ratio difference to determine if original scale mode should be used
  // Return true if ratio difference is large, should use Original mode
  _shouldUseOriginalScale(loadedImages) {
    if (loadedImages.length < 2) return false;
    
    // Calculate aspect ratio for each image
    const ratios = loadedImages.map(img => img.width / img.height);
    
    // Check if there's a mix of landscape and portrait (one >1, one <1)
    const hasLandscape = ratios.some(r => r > 1.2);  // Clearly landscape
    const hasPortrait = ratios.some(r => r < 0.8);   // Clearly portrait
    if (hasLandscape && hasPortrait) {
      // Debug log removed
      return true;
    }
    
    // Check if ratio difference is too large
    const minRatio = Math.min(...ratios);
    const maxRatio = Math.max(...ratios);
    const ratioDiff = maxRatio / minRatio;
    
    // If max ratio is more than 2x min ratio, consider difference too large
    // 例如�?:3 (1.33) vs 20:1 (20) �?20/1.33 = 15 > 2 �?
    // 例如�?:3 (1.33) vs 8:7 (1.14) �?1.33/1.14 = 1.17 < 2 �?
    if (ratioDiff > 2) {
      // Debug log removed);
      return true;
    }
    
    return false;
  }

  // Linear布局Canvas导出：等高/等宽拼接（默认模式）
  // 所有图片缩放到统一高度（横向）或统一宽度（纵向）
  async _exportLinearCanvasUniform(loadedImages, layoutData, bgColor) {
    // Debug log removed');
    const { gap, padding, direction } = layoutData;
    const isHorizontal = direction === 'row';
    
    // 找出最大高度/宽度作为基准
    let maxHeight = 0, maxWidth = 0;
    loadedImages.forEach(imgData => {
      maxHeight = Math.max(maxHeight, imgData.height);
      maxWidth = Math.max(maxWidth, imgData.width);
    });

    // 计算缩放因子：导出尺寸相对于显示画布的比例
    // 显示画布固定为 900x560，导出使用原始图片尺寸
    const displayCanvasWidth = 900;
    const displayCanvasHeight = 560;
    const displayPadding = padding * 2;
    
    // 计算显示时的有效内容区域
    const displayContentWidth = displayCanvasWidth - displayPadding;
    const displayContentHeight = displayCanvasHeight - displayPadding;
    
    // 计算每张图片的缩放后尺寸（以最大高度/宽度为基准）
    const scaledImages = loadedImages.map(imgData => {
      let scale, scaledWidth, scaledHeight;
      
      if (isHorizontal) {
        // 横向排列：所有图片高度对齐到最大高度
        scale = maxHeight / imgData.height;
        scaledWidth = Math.round(imgData.width * scale);
        scaledHeight = maxHeight;
      } else {
        // 纵向排列：所有图片宽度对齐到最大宽度
        scale = maxWidth / imgData.width;
        scaledWidth = maxWidth;
        scaledHeight = Math.round(imgData.height * scale);
      }
      
      return { ...imgData, scaledWidth, scaledHeight, scale };
    });

    // 计算导出图片的总内容尺寸（不含padding）
    let contentWidth = 0, contentHeight = 0;
    const imageCount = scaledImages.length;
    
    if (isHorizontal) {
      scaledImages.forEach(img => contentWidth += img.scaledWidth);
      contentHeight = maxHeight;
    } else {
      scaledImages.forEach(img => contentHeight += img.scaledHeight);
      contentWidth = maxWidth;
    }
    
    // 计算缩放因子：导出内容尺寸 / 显示内容尺寸
    let scaleFactor;
    if (isHorizontal) {
      scaleFactor = contentHeight / displayContentHeight;
    } else {
      scaleFactor = contentWidth / displayContentWidth;
    }
    
    // 按比例缩放 gap 和 padding
    const scaledGap = Math.round(gap * scaleFactor);
    const scaledPadding = Math.round(padding * scaleFactor);
    
    // 计算总尺寸
    let totalWidth = 0, totalHeight = 0;
    const gapTotal = scaledGap * (imageCount - 1);
    
    if (isHorizontal) {
      totalWidth = contentWidth + gapTotal + scaledPadding * 2;
      totalHeight = maxHeight + scaledPadding * 2;
    } else {
      totalHeight = contentHeight + gapTotal + scaledPadding * 2;
      totalWidth = maxWidth + scaledPadding * 2;
    }

    // 创建Canvas
    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');
    
    // 启用图片平滑（放大时减少锯齿）
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 填充背景
    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);
    }

    // 绘制图片（缩放后尺寸）
    let x = scaledPadding, y = scaledPadding;
    for (const imgData of scaledImages) {
      ctx.drawImage(imgData.img, x, y, imgData.scaledWidth, imgData.scaledHeight);
      
      if (isHorizontal) {
        x += imgData.scaledWidth + scaledGap;
      } else {
        y += imgData.scaledHeight + scaledGap;
      }
    }

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  // Linear布局Canvas导出：原始比例拼接（新增模式）
  // 保持每张图片原始尺寸，不缩放，按对齐方式排列
  async _exportLinearCanvasOriginal(loadedImages, layoutData, bgColor) {
    // Debug log removed');
    const { gap, padding, direction, align = 'center' } = layoutData;
    const isHorizontal = direction === 'row';
    
    // 计算总尺寸（使用原始图片尺寸）
    let contentWidth = 0, contentHeight = 0, maxWidth = 0, maxHeight = 0;
    
    loadedImages.forEach(imgData => {
      maxWidth = Math.max(maxWidth, imgData.width);
      maxHeight = Math.max(maxHeight, imgData.height);
      if (isHorizontal) {
        contentWidth += imgData.width;
      } else {
        contentHeight += imgData.height;
      }
    });

    // 计算缩放因子
    const displayCanvasWidth = 900;
    const displayCanvasHeight = 560;
    const displayPadding = padding * 2;
    const displayContentWidth = displayCanvasWidth - displayPadding;
    const displayContentHeight = displayCanvasHeight - displayPadding;
    
    let scaleFactor;
    if (isHorizontal) {
      scaleFactor = maxHeight / displayContentHeight;
    } else {
      scaleFactor = maxWidth / displayContentWidth;
    }
    
    // 按比例缩放 gap 和 padding
    const scaledGap = Math.round(gap * scaleFactor);
    const scaledPadding = Math.round(padding * scaleFactor);

    // 添加间距计算总尺寸
    const gapTotal = scaledGap * (loadedImages.length - 1);
    let totalWidth, totalHeight;
    if (isHorizontal) {
      totalWidth = contentWidth + gapTotal + scaledPadding * 2;
      totalHeight = maxHeight + scaledPadding * 2;
    } else {
      totalHeight = contentHeight + gapTotal + scaledPadding * 2;
      totalWidth = maxWidth + scaledPadding * 2;
    }

    // 创建Canvas
    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    // 填充背景
    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);
    }

    // 绘制图片（原始尺寸，按对齐方式排列）
    let x = scaledPadding, y = scaledPadding;
    for (const imgData of loadedImages) {
      let drawX = x, drawY = y;
      
      if (isHorizontal) {
        // 横向排列：根据align决定垂直位置
        if (align === 'start') {
          drawY = scaledPadding;
        } else if (align === 'end') {
          drawY = scaledPadding + maxHeight - imgData.height;
        } else { // center
          drawY = scaledPadding + (maxHeight - imgData.height) / 2;
        }
        ctx.drawImage(imgData.img, drawX, drawY, imgData.width, imgData.height);
        x += imgData.width + scaledGap;
      } else {
        // 纵向排列：根据align决定水平位置
        if (align === 'start') {
          drawX = scaledPadding;
        } else if (align === 'end') {
          drawX = scaledPadding + maxWidth - imgData.width;
        } else { // center
          drawX = scaledPadding + (maxWidth - imgData.width) / 2;
        }
        ctx.drawImage(imgData.img, drawX, drawY, imgData.width, imgData.height);
        y += imgData.height + scaledGap;
      }
    }

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  // Frame布局Canvas导出：原始图�?+ Frame装饰
  async _exportFrameCanvas(loadedImages, layoutData, bgColor) {
    if (loadedImages.length === 0) {
      throw new Error('No images in frame');
    }

    const imgData = loadedImages[0];
    const { frameType } = layoutData;
    
    // Frame装饰参数
    let framePadding, borderRadius, headerHeight = 0;
    if (frameType === 'phone') {
      framePadding = 16;
      borderRadius = 72;
      headerHeight = 48;
    } else if (frameType === 'tablet') {
      framePadding = 20;
      borderRadius = 40;
    } else { // browser
      framePadding = 0;
      borderRadius = 16;
      headerHeight = 64;
    }

    // 计算总尺�?
    const totalWidth = imgData.width + framePadding * 2;
    const totalHeight = imgData.height + framePadding * 2 + headerHeight;

    // 创建Canvas
    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    // 绘制Frame背景
    if (frameType === 'phone' || frameType === 'tablet') {
      ctx.fillStyle = '#1a1a1a';
      this._roundRect(ctx, 0, 0, totalWidth, totalHeight, borderRadius);
      ctx.fill();
      
      // 绘制内部白色区域
      ctx.fillStyle = '#ffffff';
      const innerRadius = frameType === 'phone' ? 56 : 24;
      this._roundRect(ctx, framePadding, framePadding + headerHeight, 
        imgData.width, imgData.height, innerRadius);
      ctx.fill();
    } else { // browser
      ctx.fillStyle = '#ffffff';
      this._roundRect(ctx, 0, 0, totalWidth, totalHeight, borderRadius);
      ctx.fill();
      
      // 绘制浏览器头�?
      ctx.fillStyle = '#f3f4f6';
      this._roundRect(ctx, 0, 0, totalWidth, headerHeight, borderRadius, true, true, false, false);
      ctx.fill();
      
      // 绘制三个按钮
      const btnY = headerHeight / 2;
      ctx.fillStyle = '#FF5F57';
      ctx.beginPath(); ctx.arc(24, btnY, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FEBC2E';
      ctx.beginPath(); ctx.arc(48, btnY, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#28C840';
      ctx.beginPath(); ctx.arc(72, btnY, 10, 0, Math.PI * 2); ctx.fill();
    }

    // 绘制原始图片
    ctx.drawImage(imgData.img, framePadding, framePadding + headerHeight, imgData.width, imgData.height);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  // 辅助函数：绘制圆角矩�?
  _roundRect(ctx, x, y, w, h, r, tl = true, tr = true, br = true, bl = true) {
    ctx.beginPath();
    ctx.moveTo(x + (tl ? r : 0), y);
    ctx.lineTo(x + w - (tr ? r : 0), y);
    if (tr) ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - (br ? r : 0));
    if (br) ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + (bl ? r : 0), y + h);
    if (bl) ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + (tl ? r : 0));
    if (tl) ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // html2canvas备用导出（用于复杂布局�?
  async _exportWithHtml2Canvas() {
    if (!this.html2canvasLoaded) await this._loadHtml2Canvas();
    
    const canvasRoot = this.canvasRenderer.getCanvasElement();
    if (!canvasRoot) throw new Error('Canvas not found');

    // Get computed background color (resolves CSS variables)
    const computedStyle = window.getComputedStyle(canvasRoot);
    let bgColor = computedStyle.backgroundColor || '#ffffff';
    // If still contains 'var', use white as fallback
    if (bgColor.includes('var')) {
      bgColor = '#ffffff';
    }
    
    const originalTransform = canvasRoot.style.transform;
    const originalBg = canvasRoot.style.background;
    canvasRoot.style.transform = 'none';
    // Temporarily set explicit background color to avoid CSS variable issues
    if (bgColor && bgColor !== 'transparent') {
      canvasRoot.style.background = bgColor;
    }

    // Hide elements that should not be exported (buttons, add slot, empty slots)
    const noExportElements = canvasRoot.querySelectorAll('[data-no-export="true"], [data-action="add-slot"], [data-action="delete-slot"], .add-slot-btn, [data-empty-slot="true"]');
    const originalDisplays = [];
    noExportElements.forEach((el, i) => {
      originalDisplays[i] = el.style.display;
      el.style.display = 'none';
    });

    // Convert CSS variables to computed values for all elements
    const elementsWithVars = canvasRoot.querySelectorAll('*');
    const originalStyles = [];
    elementsWithVars.forEach((el, i) => {
      const computed = window.getComputedStyle(el);
      const bg = computed.backgroundColor;
      const color = computed.color;
      const borderColor = computed.borderColor;
      originalStyles[i] = {
        background: el.style.background,
        backgroundColor: el.style.backgroundColor,
        color: el.style.color,
        borderColor: el.style.borderColor
      };
      // Only set if computed value is valid (not empty or 'var')
      if (bg && !bg.includes('var')) el.style.backgroundColor = bg;
      if (color && !color.includes('var')) el.style.color = color;
      if (borderColor && !borderColor.includes('var')) el.style.borderColor = borderColor;
    });

    try {
      const canvas = await window.html2canvas(canvasRoot, { 
        scale: 2,
        useCORS: true, 
        allowTaint: true, 
        backgroundColor: bgColor === 'transparent' ? null : bgColor,
        logging: false
      });
      return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    } finally {
      // Restore original styles
      elementsWithVars.forEach((el, i) => {
        if (originalStyles[i]) {
          el.style.background = originalStyles[i].background;
          el.style.backgroundColor = originalStyles[i].backgroundColor;
          el.style.color = originalStyles[i].color;
          el.style.borderColor = originalStyles[i].borderColor;
        }
      });
      noExportElements.forEach((el, i) => {
        el.style.display = originalDisplays[i];
      });
      canvasRoot.style.transform = originalTransform;
      canvasRoot.style.background = originalBg;
    }
  }

  // 主导出函数：优先使用Canvas API
  async exportToPng() {
    const layoutData = this._getLayoutData();
    
    // Linear和Frame布局使用Canvas API导出（保证原始分辨率�?
    if (layoutData && (layoutData.isLinear || layoutData.isFrame)) {
      return this._exportWithCanvas();
    }
    
    // 其他布局使用html2canvas
    return this._exportWithHtml2Canvas();
  }

  // 检查画布是否有图片
  hasImages() {
    const state = window.app?.stateManager?.getState();
    if (!state?.layoutTree?.containers) return false;
    
    for (const container of state.layoutTree.containers) {
      for (const slot of container.slots) {
        if (slot.image) return true;
      }
    }
    return false;
  }

  async downloadImage(filename) {
    // Check if there are images
    if (!this.hasImages()) {
      showToast('Please upload images first', 'error');
      return;
    }
    
    try {
      const blob = await this.exportToPng();
      if (!blob) { 
        console.error('[Export] No blob returned');
        showToast('Export failed - no image generated', 'error'); 
        return; 
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `pictrikit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Exported successfully', 'success');
    } catch (error) {
      console.error('[Export] Error:', error);
      showToast('Export failed: ' + (error.message || 'Unknown error'), 'error');
    }
  }

  async copyToClipboard() {
    // Check if there are images
    if (!this.hasImages()) {
      showToast('Please upload images first', 'error');
      return false;
    }
    
    if (!navigator.clipboard || !navigator.clipboard.write) {
      showToast('Browser does not support clipboard', 'error');
      return false;
    }
    try {
      const blob = await this.exportToPng();
      if (!blob) {
        console.error('[Copy] No blob returned');
        showToast('Copy failed - no image generated', 'error');
        return false;
      }
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('Copied to clipboard', 'success');
      return true;
    } catch (error) {
      console.error('[Copy] Error:', error);
      showToast('Copy failed: ' + (error.message || 'Unknown error'), 'error');
      return false;
    }
  }
}

// ========== Toast ==========
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.style.cssText = `padding:10px 16px;border-radius:8px;font-size:13px;font-weight:500;color:#fff;background:${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#374151'};box-shadow:0 4px 12px rgba(0,0,0,0.15);transform:translateX(100%);transition:transform 0.3s ease;`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  setTimeout(() => { toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ========== App ==========
class App {
  constructor() {
    this.eventBus = new EventBus();
    this.stateManager = new StateManager(this.eventBus);
    this.layoutSystem = new LayoutSystem(this.stateManager);
    this.containerSystem = new ContainerSystem(this.stateManager);
    this.imageHandler = new ImageHandler(this.stateManager);
    this.canvasRenderer = new CanvasRenderer(this.stateManager);
    this.exportSystem = new ExportSystem(this.canvasRenderer);
  }

  init() {
    this.stateManager.subscribe((state) => this.canvasRenderer.render(state));
    this.bindLayoutPanel();
    this.bindPropertiesPanel();
    this.bindCanvasInteractions();
    this.bindToolbar();
    this.bindZoomControls();
    this.bindCanvasPanning();  // 添加画板拖动功能
    this.canvasRenderer.render(this.stateManager.getState());
    // Debug log removed
  }

  bindLayoutPanel() {
    document.querySelectorAll('[data-layout-type]').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('[data-layout-type]').forEach(c => c.style.borderColor = '#e5e7eb');
        card.style.borderColor = '#3b82f6';
        this.layoutSystem.createLayout(card.dataset.layoutType);
        
        // 选择布局后自动关闭面板（桌面端和移动端）
        const panel = document.getElementById('panel');
        if (panel) {
          if (window.innerWidth <= 768) {
            panel.classList.remove('panel-open');
          } else {
            // 桌面端：收起面板宽度
            panel.style.width = '0';
          }
        }
      });
    });
  }

  bindPropertiesPanel() {
    ['padding', 'gap', 'roundness'].forEach(prop => {
      const slider = document.querySelector(`[data-property="${prop}"]`);
      const display = document.querySelector(`[data-display="${prop}"]`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value, 10);
          this.stateManager.setProperty(prop, value);
          if (display) display.textContent = value;
        });
      }
    });
  }

  bindCanvasInteractions() {
    const canvasRoot = document.getElementById('canvas-root');
    if (!canvasRoot) return;

    canvasRoot.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete-slot"]');
      const addSlotBtn = e.target.closest('[data-action="add-slot"]');
      const slot = e.target.closest('[data-slot-id]');

      if (deleteBtn) {
        e.stopPropagation();
        const slotEl = deleteBtn.closest('[data-slot-id]');
        if (slotEl) this.imageHandler.removeFromSlot(slotEl.dataset.slotId);
        return;
      }

      if (addSlotBtn) {
        e.stopPropagation();
        if (addSlotBtn.dataset.layoutId) {
          this.layoutSystem.addSlot(addSlotBtn.dataset.layoutId);
        }
        return;
      }

      if (slot && !slot.querySelector('img')) {
        this.imageHandler.openFilePicker(slot.dataset.slotId);
      }
    });

    canvasRoot.addEventListener('dragover', (e) => { e.preventDefault(); });
    canvasRoot.addEventListener('drop', (e) => {
      e.preventDefault();
      const slot = e.target.closest('[data-slot-id]');
      if (slot) this.imageHandler.handleDrop(slot.dataset.slotId, e.dataTransfer);
    });
  }

  bindToolbar() {
    document.querySelector('[data-action="export"]')?.addEventListener('click', () => this.exportSystem.downloadImage());
    document.querySelector('[data-action="copy"]')?.addEventListener('click', () => this.exportSystem.copyToClipboard());
    // 支持多个undo/redo按钮（桌面端和移动端�?
    document.querySelectorAll('[data-action="undo"]').forEach(btn => {
      btn.addEventListener('click', () => this.stateManager.undo());
    });
    document.querySelectorAll('[data-action="redo"]').forEach(btn => {
      btn.addEventListener('click', () => this.stateManager.redo());
    });
    
    // Background color picker
    const bgColorPicker = document.getElementById('bg-color-picker');
    const bgColorBtn = document.getElementById('bg-color-btn');
    const mobileBgColorBtn = document.getElementById('mobile-bg-color-btn');
    const bgColorPreview = document.getElementById('bg-color-preview');
    const mobileBgColorPreview = document.getElementById('mobile-bg-color-preview');
    const colorPickerPanel = document.getElementById('color-picker-panel');
    const canvasRoot = document.getElementById('canvas-root');
    const presetColors = document.querySelectorAll('.preset-color');
    
    // 设置背景颜色的函�?
    const setBackgroundColor = (color) => {
      if (canvasRoot) {
        if (color === 'transparent') {
          canvasRoot.style.background = 'transparent';
          canvasRoot.style.boxShadow = '0 0 0 1px #d1d1d6, 0 4px 20px rgba(0,0,0,0.08)';
        } else {
          canvasRoot.style.background = color;
          canvasRoot.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }
      }
      // 更新桌面端预�?
      if (bgColorPreview) {
        if (color === 'transparent') {
          bgColorPreview.style.background = 'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%)';
          bgColorPreview.style.backgroundSize = '8px 8px';
          bgColorPreview.style.backgroundPosition = '0 0,4px 4px';
        } else {
          bgColorPreview.style.background = color;
          bgColorPreview.style.backgroundSize = '';
          bgColorPreview.style.backgroundPosition = '';
        }
      }
      // 更新移动端预�?
      if (mobileBgColorPreview) {
        if (color === 'transparent') {
          mobileBgColorPreview.style.background = 'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%)';
          mobileBgColorPreview.style.backgroundSize = '8px 8px';
          mobileBgColorPreview.style.backgroundPosition = '0 0,4px 4px';
        } else {
          mobileBgColorPreview.style.background = color;
          mobileBgColorPreview.style.backgroundSize = '';
          mobileBgColorPreview.style.backgroundPosition = '';
        }
      }
    };
    
    // Debug log removed
    console.log('[Color] Elements:', {
      bgColorBtn: !!bgColorBtn,
      mobileBgColorBtn: !!mobileBgColorBtn,
      colorPickerPanel: !!colorPickerPanel
    });
    
    if (colorPickerPanel) {
      console.log('[Color] Panel computed style:', {
        display: window.getComputedStyle(colorPickerPanel).display,
        position: window.getComputedStyle(colorPickerPanel).position,
        zIndex: window.getComputedStyle(colorPickerPanel).zIndex,
        visibility: window.getComputedStyle(colorPickerPanel).visibility
      });
    }
    
    // 切换颜色面板显示
    const toggleColorPanel = (e) => {
      // Debug log removed
      e.preventDefault();
      e.stopPropagation();
      
      if (!colorPickerPanel) {
        console.error('[Color] Panel not found');
        return;
      }
      
      const currentDisplay = colorPickerPanel.style.display;
      const newDisplay = currentDisplay === 'block' ? 'none' : 'block';
      colorPickerPanel.style.display = newDisplay;
      
      // 强制设置其他样式确保可见
      if (newDisplay === 'block') {
        colorPickerPanel.style.visibility = 'visible';
        colorPickerPanel.style.opacity = '1';
        colorPickerPanel.style.pointerEvents = 'auto';
      }
      
      // Debug log removed
      // Debug log removed);
    };
    
    // 桌面端颜色按�?
    if (bgColorBtn) {
      // Debug log removed
      bgColorBtn.addEventListener('click', toggleColorPanel);
    }
    
    // 移动端颜色按�?
    if (mobileBgColorBtn) {
      // Debug log removed
      mobileBgColorBtn.addEventListener('click', toggleColorPanel);
    }
    
    // 点击其他地方关闭面板
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!colorPickerPanel) return;
        
        const isColorBtn = (bgColorBtn && bgColorBtn.contains(e.target)) || 
                          (mobileBgColorBtn && mobileBgColorBtn.contains(e.target));
        const isPanel = colorPickerPanel.contains(e.target);
        
        if (!isColorBtn && !isPanel && colorPickerPanel.style.display === 'block') {
          colorPickerPanel.style.display = 'none';
          // Debug log removed
        }
      });
    }, 100);
    
    // 预设颜色点击
    presetColors.forEach(preset => {
      preset.addEventListener('click', () => {
        const color = preset.dataset.color;
        setBackgroundColor(color);
        if (color !== 'transparent' && bgColorPicker) {
          bgColorPicker.value = color;
        }
      });
    });
    
    // 自定义颜色选择
    if (bgColorPicker) {
      bgColorPicker.addEventListener('input', (e) => {
        setBackgroundColor(e.target.value);
      });
    }
    // fit 按钮�?bindCanvasPanning 中处�?
  }

  bindZoomControls() {
    // 支持多个缩放按钮（桌面端和移动端�?
    document.querySelectorAll('[data-action="zoom-in"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.stateManager.setZoom(Math.min(2, this.stateManager.getState().zoom + 0.1));
      });
    });
    document.querySelectorAll('[data-action="zoom-out"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.stateManager.setZoom(Math.max(0.5, this.stateManager.getState().zoom - 0.1));
      });
    });
  }

  // 空格+鼠标拖动画板功能
  bindCanvasPanning() {
    const mainArea = document.getElementById('canvas-area');
    const canvasRoot = document.getElementById('canvas-root');
    if (!mainArea || !canvasRoot) return;

    let isPanning = false;
    let isSpacePressed = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    // 监听空格�?
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !isSpacePressed && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        isSpacePressed = true;
        mainArea.classList.add('space-pressed');
        mainArea.style.cursor = 'grab';
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        isSpacePressed = false;
        isPanning = false;
        mainArea.classList.remove('space-pressed', 'panning');
        mainArea.style.cursor = '';
      }
    });

    // 鼠标按下开始拖�?
    mainArea.addEventListener('mousedown', (e) => {
      if (isSpacePressed && e.button === 0) {
        e.preventDefault();
        isPanning = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        mainArea.classList.add('panning');
        mainArea.style.cursor = 'grabbing';
      }
    });

    // 鼠标移动
    document.addEventListener('mousemove', (e) => {
      if (isPanning) {
        e.preventDefault();
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        const zoom = this.stateManager.getState().zoom;
        canvasRoot.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
      }
    });

    // 鼠标松开
    document.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        mainArea.classList.remove('panning');
        if (isSpacePressed) {
          mainArea.style.cursor = 'grab';
        } else {
          mainArea.style.cursor = '';
        }
      }
    });

    // 重置位置按钮
    document.querySelector('[data-action="fit"]')?.addEventListener('click', () => {
      offsetX = 0;
      offsetY = 0;
      this.stateManager.setZoom(1);
      canvasRoot.style.transform = 'translate(0, 0) scale(1)';
    });

    // 更新缩放时保持位�?
    this.stateManager.subscribe((state) => {
      canvasRoot.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${state.zoom})`;
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.app = app;
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.className = savedTheme;
  updateThemeIcon(savedTheme);
  
  function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }
  
  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.className;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    // Debug log removed
  });
  
  // 工具栏交互 - 悬停打开/离开关闭，点击只做视觉选中
  const toolbar = document.getElementById('toolbar');
  const panel = document.getElementById('panel');
  const panelTitle = document.getElementById('panel-title');
  const panelClose = document.getElementById('panel-close');
  const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
  let currentTool = null;
  let selectedTool = null;  // 用户选中的工具（仅视觉显示）
  let isMouseInArea = false;
  
  const panelTitles = {
    linear: 'Linear Layouts',
    focus: 'Focus Layouts',
    grid: 'Grid Layouts',
    compare: 'Compare Layouts',
    frames: 'Device Frames',
    properties: 'Style Settings'
  };
  
  function openPanel(tool) {
    if (currentTool === tool) return;
    
    panelTitle.textContent = panelTitles[tool] || tool;
    
    document.querySelectorAll('.panel-section').forEach(section => {
      section.style.display = 'none';
    });
    
    const targetPanel = document.querySelector(`[data-panel="${tool}"]`);
    if (targetPanel) {
      targetPanel.style.display = 'block';
    }
    
    panel.style.width = '260px';
    currentTool = tool;
    
    // 更新按钮状态：active表示当前悬停/打开的，selected表示用户选中的
    toolBtns.forEach(btn => {
      const isActive = btn.dataset.tool === tool;
      const isSelected = btn.dataset.tool === selectedTool;
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('selected', isSelected);
    });
  }
  
  function closePanel() {
    panel.style.width = '0';
    currentTool = null;
    toolBtns.forEach(btn => {
      btn.classList.remove('active');
      // 保留 selected 状态
    });
  }
  
  // 点击工具按钮 - 仅做视觉选中，不执行其他逻辑
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.tool;
      // 更新选中状态（仅视觉）
      selectedTool = tool;
      toolBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    
    // 悬停打开面板
    btn.addEventListener('mouseenter', () => {
      isMouseInArea = true;
      openPanel(btn.dataset.tool);
    });
  });
  
  // 监听工具栏和面板的鼠标进入/离开
  toolbar.addEventListener('mouseenter', () => {
    isMouseInArea = true;
  });
  
  toolbar.addEventListener('mouseleave', (e) => {
    const rect = panel.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && 
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
      return;
    }
    isMouseInArea = false;
    setTimeout(() => {
      if (!isMouseInArea) closePanel();
    }, 100);
  });
  
  panel.addEventListener('mouseenter', () => {
    isMouseInArea = true;
  });
  
  panel.addEventListener('mouseleave', (e) => {
    const rect = toolbar.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && 
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
      return;
    }
    isMouseInArea = false;
    setTimeout(() => {
      if (!isMouseInArea) closePanel();
    }, 100);
  });
  
  // 关闭按钮
  panelClose?.addEventListener('click', () => {
    panel.style.width = '0';
    panel.classList.remove('panel-open');
    currentTool = null;
    toolBtns.forEach(btn => {
      btn.classList.remove('active');
    });
  });
});

