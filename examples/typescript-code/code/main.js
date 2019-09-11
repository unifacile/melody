var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyAbstract = /** @class */ (function () {
    function MyAbstract(name, lastname) {
        this.name = name;
        this.lastname = lastname;
    }
    return MyAbstract;
}());
var MyMario = /** @class */ (function (_super) {
    __extends(MyMario, _super);
    function MyMario(year) {
        var _this = _super.call(this, "Mario", "Rossi") || this;
        _this.year = year;
        return _this;
    }
    return MyMario;
}(MyAbstract));

var func = function (demo) {
    var n = demo * 2;
    --n;
    return n;
};

//# sourceMappingURL=main.js.map
