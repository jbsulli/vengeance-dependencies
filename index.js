
class VengeanceDependencies {
    constructor(){
        this.deps = {};
    }

    add(key, deps){
        this.deps[key] = deps;
    }

    getOrder(){
        var order = [];
        var keys = [];
        var visited = {};
        
        for(var key in this.deps){
            keys.push(key);
        }
        
        keys.sort();
        
        for(var i = 0; i < keys.length; i++){
            key = keys[i];
            
            addDepsToOutputOrder(key, order, visited, this.deps);
        }
        
        return order;
    }
}

function addDepsToOutputOrder(key, order, visited, deps, _parents){
    if(visited[key]){
        return;
    }
    
    _parents = _parents || {};
    
    if(_parents[key]){
        throw new Error('Circular dependency! [' + key + ']');
    }
    
    _parents[key] = true;
    
    var dep_deps = deps[key];
    
    if(dep_deps){
        var dep_deps_order = [];
        for(var dep in dep_deps){
            dep_deps_order.push(dep);
        }
        dep_deps_order.sort();
        for(var i = 0; i < dep_deps_order.length; i++){
            addDepsToOutputOrder(dep_deps_order[i], order, visited, deps, _parents);
        }
    }
    
    order.push(key);
    visited[key] = true;
}

module.exports = VengeanceDependencies;