'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('../../polyfills/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectGetPrototypeOf = require('../../polyfills/objectGetPrototypeOf');

var _objectGetPrototypeOf2 = _interopRequireDefault(_objectGetPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('../../polyfills/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('../../polyfills/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('../../polyfills/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

require('../../vendor/raf-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _store = require('../../utils/store');

var _store2 = _interopRequireDefault(_store);

var _frequently = require('../../utils/frequently');

var _frequently2 = _interopRequireDefault(_frequently);

var _utils = require('../../utils');

var _data = require('../../utils/data');

var _sharedProps = require('../../utils/shared-props');

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var I18N = {
  search: 'Search',
  notfound: 'No Emoji Found',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    smileys: 'Smileys & Emotion',
    people: 'People & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom'
  }
};

var NimblePicker = function (_React$PureComponent) {
  (0, _inherits3.default)(NimblePicker, _React$PureComponent);

  function NimblePicker(props) {
    (0, _classCallCheck3.default)(this, NimblePicker);

    var _this = (0, _possibleConstructorReturn3.default)(this, (NimblePicker.__proto__ || (0, _objectGetPrototypeOf2.default)(NimblePicker)).call(this, props));

    _this.CUSTOM = [];

    _this.RECENT_CATEGORY = { id: 'recent', name: 'Recent', emojis: null };
    _this.SEARCH_CATEGORY = {
      id: 'search',
      name: 'Search',
      emojis: null,
      anchor: false
    };

    if (props.data.compressed) {
      (0, _data.uncompress)(props.data);
    }

    _this.data = props.data;
    _this.i18n = (0, _utils.deepMerge)(I18N, props.i18n);
    _this.state = {
      skin: props.skin || _store2.default.get('skin') || props.defaultSkin,
      firstRender: true
    };

    _this.categories = [];
    var allCategories = [].concat(_this.data.categories);

    if (props.custom.length > 0) {
      var customCategories = {};
      var customCategoriesCreated = 0;

      props.custom.forEach(function (emoji) {
        if (!customCategories[emoji.customCategory]) {
          customCategories[emoji.customCategory] = {
            id: emoji.customCategory ? 'custom-' + emoji.customCategory : 'custom',
            name: emoji.customCategory || 'Custom',
            emojis: [],
            anchor: customCategoriesCreated === 0
          };

          customCategoriesCreated++;
        }

        var category = customCategories[emoji.customCategory];

        var customEmoji = (0, _extends3.default)({}, emoji, {
          // `<Category />` expects emoji to have an `id`.
          id: emoji.short_names[0],
          custom: true
        });

        category.emojis.push(customEmoji);
        _this.CUSTOM.push(customEmoji);
      });

      allCategories.push.apply(allCategories, (0, _toConsumableArray3.default)((0, _values2.default)(customCategories)));
    }

    _this.hideRecent = true;

    if (props.include != undefined) {
      allCategories.sort(function (a, b) {
        if (props.include.indexOf(a.id) > props.include.indexOf(b.id)) {
          return 1;
        }

        return -1;
      });
    }

    for (var categoryIndex = 0; categoryIndex < allCategories.length; categoryIndex++) {
      var category = allCategories[categoryIndex];
      var isIncluded = props.include && props.include.length ? props.include.indexOf(category.id) > -1 : true;
      var isExcluded = props.exclude && props.exclude.length ? props.exclude.indexOf(category.id) > -1 : false;
      if (!isIncluded || isExcluded) {
        continue;
      }

      if (props.emojisToShowFilter) {
        var newEmojis = [];

        var emojis = category.emojis;

        for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          var emoji = emojis[emojiIndex];
          if (props.emojisToShowFilter(_this.data.emojis[emoji] || emoji)) {
            newEmojis.push(emoji);
          }
        }

        if (newEmojis.length) {
          var newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id
          };

          _this.categories.push(newCategory);
        }
      } else {
        _this.categories.push(category);
      }
    }

    var includeRecent = props.include && props.include.length ? props.include.indexOf(_this.RECENT_CATEGORY.id) > -1 : true;
    var excludeRecent = props.exclude && props.exclude.length ? props.exclude.indexOf(_this.RECENT_CATEGORY.id) > -1 : false;
    if (includeRecent && !excludeRecent) {
      _this.hideRecent = false;
      _this.categories.unshift(_this.RECENT_CATEGORY);
    }

    if (_this.categories[0]) {
      _this.categories[0].first = true;
    }

    _this.categories.unshift(_this.SEARCH_CATEGORY);

    _this.setAnchorsRef = _this.setAnchorsRef.bind(_this);
    _this.handleAnchorClick = _this.handleAnchorClick.bind(_this);
    _this.setSearchRef = _this.setSearchRef.bind(_this);
    _this.handleSearch = _this.handleSearch.bind(_this);
    _this.setScrollRef = _this.setScrollRef.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    _this.handleScrollPaint = _this.handleScrollPaint.bind(_this);
    _this.handleEmojiOver = _this.handleEmojiOver.bind(_this);
    _this.handleEmojiLeave = _this.handleEmojiLeave.bind(_this);
    _this.handleEmojiClick = _this.handleEmojiClick.bind(_this);
    _this.handleEmojiSelect = _this.handleEmojiSelect.bind(_this);
    _this.setPreviewRef = _this.setPreviewRef.bind(_this);
    _this.handleSkinChange = _this.handleSkinChange.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(NimblePicker, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.skin) {
        this.setState({ skin: props.skin });
      } else if (props.defaultSkin && !_store2.default.get('skin')) {
        this.setState({ skin: props.defaultSkin });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.firstRender) {
        this.testStickyPosition();
        this.firstRenderTimeout = setTimeout(function () {
          _this2.setState({ firstRender: false });
        }, 60);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateCategoriesSize();
      this.handleScroll();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.SEARCH_CATEGORY.emojis = null;

      clearTimeout(this.leaveTimeout);
      clearTimeout(this.firstRenderTimeout);
    }
  }, {
    key: 'testStickyPosition',
    value: function testStickyPosition() {
      var stickyTestElement = document.createElement('div');

      var prefixes = ['', '-webkit-', '-ms-', '-moz-', '-o-'];

      prefixes.forEach(function (prefix) {
        return stickyTestElement.style.position = prefix + 'sticky';
      });

      this.hasStickyPosition = !!stickyTestElement.style.position.length;
    }
  }, {
    key: 'handleEmojiOver',
    value: function handleEmojiOver(emoji) {
      var preview = this.preview;

      if (!preview) {
        return;
      }

      // Use Array.prototype.find() when it is more widely supported.
      var emojiData = this.CUSTOM.filter(function (customEmoji) {
        return customEmoji.id === emoji.id;
      })[0];
      for (var key in emojiData) {
        if (emojiData.hasOwnProperty(key)) {
          emoji[key] = emojiData[key];
        }
      }

      preview.setState({ emoji: emoji });
      clearTimeout(this.leaveTimeout);
    }
  }, {
    key: 'handleEmojiLeave',
    value: function handleEmojiLeave(emoji) {
      var preview = this.preview;

      if (!preview) {
        return;
      }

      this.leaveTimeout = setTimeout(function () {
        preview.setState({ emoji: null });
      }, 16);
    }
  }, {
    key: 'handleEmojiClick',
    value: function handleEmojiClick(emoji, e) {
      this.props.onClick(emoji, e);
      this.handleEmojiSelect(emoji);
    }
  }, {
    key: 'handleEmojiSelect',
    value: function handleEmojiSelect(emoji) {
      var _this3 = this;

      this.props.onSelect(emoji);
      if (!this.hideRecent && !this.props.recent) _frequently2.default.add(emoji);

      var component = this.categoryRefs['category-1'];
      if (component) {
        var maxMargin = component.maxMargin;
        component.forceUpdate();

        window.requestAnimationFrame(function () {
          if (!_this3.scroll) return;
          component.memoizeSize();
          if (maxMargin == component.maxMargin) return;

          _this3.updateCategoriesSize();
          _this3.handleScrollPaint();

          if (_this3.SEARCH_CATEGORY.emojis) {
            component.updateDisplay('none');
          }
        });
      }
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      if (!this.waitingForPaint) {
        this.waitingForPaint = true;
        window.requestAnimationFrame(this.handleScrollPaint);
      }
    }
  }, {
    key: 'handleScrollPaint',
    value: function handleScrollPaint() {
      this.waitingForPaint = false;

      if (!this.scroll) {
        return;
      }

      var activeCategory = null;

      if (this.SEARCH_CATEGORY.emojis) {
        activeCategory = this.SEARCH_CATEGORY;
      } else {
        var target = this.scroll,
            scrollTop = target.scrollTop,
            scrollingDown = scrollTop > (this.scrollTop || 0),
            minTop = 0;

        for (var i = 0, l = this.categories.length; i < l; i++) {
          var ii = scrollingDown ? this.categories.length - 1 - i : i,
              category = this.categories[ii],
              component = this.categoryRefs['category-' + ii];

          if (component) {
            var active = component.handleScroll(scrollTop);

            if (!minTop || component.top < minTop) {
              if (component.top > 0) {
                minTop = component.top;
              }
            }

            if (active && !activeCategory) {
              activeCategory = category;
            }
          }
        }

        if (scrollTop < minTop) {
          activeCategory = this.categories.filter(function (category) {
            return !(category.anchor === false);
          })[0];
        } else if (scrollTop + this.clientHeight >= this.scrollHeight) {
          activeCategory = this.categories[this.categories.length - 1];
        }
      }

      if (activeCategory) {
        var anchors = this.anchors;
        var _activeCategory = activeCategory;
        var categoryName = _activeCategory.name;


        if (anchors.state.selected != categoryName) {
          anchors.setState({ selected: categoryName });
        }
      }

      this.scrollTop = scrollTop;
    }
  }, {
    key: 'handleSearch',
    value: function handleSearch(emojis) {
      this.SEARCH_CATEGORY.emojis = emojis;

      for (var i = 0, l = this.categories.length; i < l; i++) {
        var component = this.categoryRefs['category-' + i];

        if (component && component.props.name != 'Search') {
          var display = emojis ? 'none' : 'inherit';
          component.updateDisplay(display);
        }
      }

      this.forceUpdate();
      this.scroll.scrollTop = 0;
      this.handleScroll();
    }
  }, {
    key: 'handleAnchorClick',
    value: function handleAnchorClick(category, i) {
      var component = this.categoryRefs['category-' + i];
      var scroll = this.scroll;
      var anchors = this.anchors;
      var scrollToComponent = null;

      scrollToComponent = function scrollToComponent() {
        if (component) {
          var top = component.top;


          if (category.first) {
            top = 0;
          } else {
            top += 1;
          }

          scroll.scrollTop = top;
        }
      };

      if (this.SEARCH_CATEGORY.emojis) {
        this.handleSearch(null);
        this.search.clear();

        window.requestAnimationFrame(scrollToComponent);
      } else {
        scrollToComponent();
      }
    }
  }, {
    key: 'handleSkinChange',
    value: function handleSkinChange(skin) {
      var newState = { skin: skin };
      var onSkinChange = this.props.onSkinChange;


      this.setState(newState);
      _store2.default.update(newState);

      onSkinChange(skin);
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      var handled = false;

      switch (e.keyCode) {
        case 13:
          var emoji = void 0;

          if (this.SEARCH_CATEGORY.emojis && (emoji = this.SEARCH_CATEGORY.emojis[0])) {
            this.handleEmojiSelect(emoji);
          }

          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();
      }
    }
  }, {
    key: 'updateCategoriesSize',
    value: function updateCategoriesSize() {
      for (var i = 0, l = this.categories.length; i < l; i++) {
        var component = this.categoryRefs['category-' + i];
        if (component) component.memoizeSize();
      }

      if (this.scroll) {
        var target = this.scroll;
        this.scrollHeight = target.scrollHeight;
        this.clientHeight = target.clientHeight;
      }
    }
  }, {
    key: 'getCategories',
    value: function getCategories() {
      return this.state.firstRender ? this.categories.slice(0, 3) : this.categories;
    }
  }, {
    key: 'setAnchorsRef',
    value: function setAnchorsRef(c) {
      this.anchors = c;
    }
  }, {
    key: 'setSearchRef',
    value: function setSearchRef(c) {
      this.search = c;
    }
  }, {
    key: 'setPreviewRef',
    value: function setPreviewRef(c) {
      this.preview = c;
    }
  }, {
    key: 'setScrollRef',
    value: function setScrollRef(c) {
      this.scroll = c;
    }
  }, {
    key: 'setCategoryRef',
    value: function setCategoryRef(name, c) {
      if (!this.categoryRefs) {
        this.categoryRefs = {};
      }

      this.categoryRefs[name] = c;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props;
      var perLine = _props.perLine;
      var emojiSize = _props.emojiSize;
      var set = _props.set;
      var sheetSize = _props.sheetSize;
      var style = _props.style;
      var title = _props.title;
      var emoji = _props.emoji;
      var color = _props.color;
      var native = _props.native;
      var backgroundImageFn = _props.backgroundImageFn;
      var emojisToShowFilter = _props.emojisToShowFilter;
      var showPreview = _props.showPreview;
      var showSkinTones = _props.showSkinTones;
      var emojiTooltip = _props.emojiTooltip;
      var include = _props.include;
      var exclude = _props.exclude;
      var recent = _props.recent;
      var autoFocus = _props.autoFocus;
      var skin = this.state.skin;
      var width = perLine * (emojiSize + 12) + 12 + 2 + (0, _utils.measureScrollbar)();

      return _react2.default.createElement(
        'div',
        {
          style: (0, _extends3.default)({ width: width }, style),
          className: 'emoji-mart',
          onKeyDown: this.handleKeyDown
        },
        _react2.default.createElement(
          'div',
          { className: 'emoji-mart-bar' },
          _react2.default.createElement(_.Anchors, {
            ref: this.setAnchorsRef,
            data: this.data,
            i18n: this.i18n,
            color: color,
            categories: this.categories,
            onAnchorClick: this.handleAnchorClick
          })
        ),
        _react2.default.createElement(_.Search, {
          ref: this.setSearchRef,
          onSearch: this.handleSearch,
          data: this.data,
          i18n: this.i18n,
          emojisToShowFilter: emojisToShowFilter,
          include: include,
          exclude: exclude,
          custom: this.CUSTOM,
          autoFocus: autoFocus
        }),
        _react2.default.createElement(
          'div',
          {
            ref: this.setScrollRef,
            className: 'emoji-mart-scroll',
            onScroll: this.handleScroll
          },
          this.getCategories().map(function (category, i) {
            return _react2.default.createElement(_.Category, {
              ref: _this4.setCategoryRef.bind(_this4, 'category-' + i),
              key: category.name,
              id: category.id,
              name: category.name,
              emojis: category.emojis,
              perLine: perLine,
              native: native,
              hasStickyPosition: _this4.hasStickyPosition,
              data: _this4.data,
              i18n: _this4.i18n,
              recent: category.id == _this4.RECENT_CATEGORY.id ? recent : undefined,
              custom: category.id == _this4.RECENT_CATEGORY.id ? _this4.CUSTOM : undefined,
              emojiProps: {
                native: native,
                skin: skin,
                size: emojiSize,
                set: set,
                sheetSize: sheetSize,
                forceSize: native,
                tooltip: emojiTooltip,
                backgroundImageFn: backgroundImageFn,
                onOver: _this4.handleEmojiOver,
                onLeave: _this4.handleEmojiLeave,
                onClick: _this4.handleEmojiClick
              }
            });
          })
        ),
        showPreview && _react2.default.createElement(
          'div',
          { className: 'emoji-mart-bar' },
          _react2.default.createElement(_.Preview, {
            ref: this.setPreviewRef,
            data: this.data,
            title: title,
            emoji: emoji,
            showSkinTones: showSkinTones,
            emojiProps: {
              native: native,
              size: 38,
              skin: skin,
              set: set,
              sheetSize: sheetSize,
              backgroundImageFn: backgroundImageFn
            },
            skinsProps: {
              skin: skin,
              onChange: this.handleSkinChange
            }
          })
        )
      );
    }
  }]);
  return NimblePicker;
}(_react2.default.PureComponent);

exports.default = NimblePicker;

NimblePicker.defaultProps = (0, _extends3.default)({}, _sharedProps.PickerDefaultProps);