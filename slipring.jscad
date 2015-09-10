function getParameterDefinitions() {
    return [{
        name: 'inner_dia',
        initial: 5.0,
        type: 'float'
    }, {
        name: 'outer_dia',
        initial: 7.0,
        type: 'float'
    }, {
        name: 'brim_dia',
        initial: 10.0,
        type: 'float'
    }, {
        name: 'brim_thickness',
        initial: 2.0,
        type: 'float'
    }, {
        name: 'overall_height',
        initial: 25.0,
        type: 'float'
    }, {
        name: 'slice_thickness',
        initial: 3.0,
        type: 'float'
    }, ];
}

function returnSlicing(p) {
    var rectSize = p.overall_height * 10;

    var rect = cube([p.slice_thickness, rectSize, rectSize]).center(true);

    //this transformation of the cutting cylinder isn't correct, needs to be thought out on how to be accomplished
    var rectTrans = new CSG.Matrix4x4();
    rectTrans = rectTrans.multiply(CSG.Matrix4x4.rotationY(45));
    rectTrans = rectTrans.multiply(CSG.Matrix4x4.translation([rectSize / 2, 0, 0]));
    return rect.transform(rectTrans);
}

function main(param) {
    var o = []; // stack of objects

    var mainTube = cylinder({
        d: param.outer_dia,
        h: param.overall_height,
        center: true
    });
    o.push(mainTube);
    var topBrim = cylinder({
        d: param.brim_dia,
        h: param.brim_thickness,
        center: true
    }).translate([0, 0, param.overall_height / 2 - param.brim_thickness / 2]);
    o.push(topBrim);
    var bottomBrim = topBrim.mirroredZ();
    o.push(bottomBrim);

    var centerHole = cylinder({
        d: param.inner_dia,
        h: param.overall_height + 1,
        center: true
    });

    return difference(difference(union(o), centerHole), returnSlicing(param));
}