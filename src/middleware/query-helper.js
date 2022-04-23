const { mongo } = require('mongoose')
const mongoose = require('../db/mongoose')

const buildFilterQuery = (query_string, filter_parameters, filterQuery) => {

    try
    {
        const inputFilterParametersPairs = query_string.split('&&') 
        inputFilterParametersPairs.forEach(pair => {
            
            const operators = ['==', '!=', '>=', '<=', '>', '<']
           
            for (var i = 0; i < operators.length; i++)
            {
                var temp = splitPair(pair, operators[i])

                if (temp.length == 2)
                {
                    addToFilterQuery(temp, operators[i], filter_parameters, filterQuery)
                    break
                }      
            }
        })

    }
    catch(e)
    {
        throw e;
    }
}

const splitPair = (pair, separator) => {
    return pair.split(separator)
}

const addToFilterQuery = (pair, operator, filter_parameters, filterQuery) => {
    
    var filterParameter = filter_parameters.find(x => x.name.toLowerCase() === pair[0].toLowerCase())

    if (filterParameter)
    {
        var propertyName = filterParameter.name
       
        if (operator === '==')
        {  
            if (filterQuery[propertyName])
            {
                filterQuery[propertyName]['$eq'] = castObject(filterParameter.type, pair[1])
            }
            else
            {
                var obj = {}
                obj['$eq'] = castObject(filterParameter.type, pair[1])
                filterQuery[propertyName] = obj
            }
        }
        else if (operator === '!=')
        {
            if (filterQuery[propertyName])
            {
                filterQuery[propertyName]['$ne'] = castObject(filterParameter.type, pair[1])
            }
            else
            {
                var obj = {}
                obj['$ne'] = castObject(filterParameter.type, pair[1])
                filterQuery[propertyName] = obj
            }
        }
        else if (operator === '>')
        { 
            if (filterQuery[propertyName])
            {
                filterQuery[propertyName]['$gt'] = castObject(filterParameter.type, pair[1])
            }   
            else
            {
                var obj = {}
                obj['$gt'] = castObject(filterParameter.type, pair[1])
                filterQuery[propertyName] = obj
            }       
        }
        else if (operator === '>=')
        {
            if (filterQuery[propertyName])
            {
                filterQuery[propertyName]['$gte'] = castObject(filterParameter.type, pair[1])
            }   
            else
            {
                var obj = {}
                obj['$gte'] = castObject(filterParameter.type, pair[1])
                filterQuery[propertyName] = obj
            }  
        }
        else if (operator === '<')
        {
            if (filterQuery[propertyName])
            {
                filterQuery[propertyName]['$lt'] = castObject(filterParameter.type, pair[1])
            }   
            else
            {
                var obj = {}
                obj['$lt'] = castObject(filterParameter.type, pair[1])
                filterQuery[propertyName] = obj  
            }
        }
        else if (operator === '<=')
        {
            if (filterQuery[propertyName])
            {
                filterQuery[propertyName]['$lte'] = castObject(filterParameter.type, pair[1])
            }   
            else
            {
                var obj = {}
                obj['$lte'] = castObject(filterParameter.type, pair[1])
                filterQuery[propertyName] = obj
            }  
        }
    }
}

const castObject = (type, value) => {
    
    var objType = type.toLowerCase()

    if (objType === 'string')
    {
        return value
    }
    else if (objType === 'boolean')
    {
        return value === 'true'
    }
    else if (objType === 'date')
    {
        return new Date(value)
    }
    else if (objType == 'guid')
    {
        return new mongo.ObjectId(value)
    }
    else if (objType == 'integer')
    {
        return parseInt(value)
    }
}

const buildQueryOptions = (query_string, options) => {

    try
    {
        if (query_string.limit)
        {
            var limit = parseInt(query_string.limit);
           
            if (limit)
            {
               options.limit = limit
            }
        }

        if (query_string.skip)
        {
            var skip = parseInt(query_string.skip)
            
            if (skip)
            {
               options.skip = skip
            }
        }

        if (query_string.sortBy)
        {
            const sortOption = query_string.sortBy;
            var sort = {}
            
            if (query_string.sortOrder)
            {
                if (query_string.sortOrder.toLowerCase() === 'desc')
                {
                    sort[sortOption] = -1;
                }
                else
                {
                    sort[sortOption] = 1;
                }
            }
            else
            {
                sort[sortOption] = 1;
            }
             
            options.sort = sort
        }
    }
    catch(e)
    {
        throw e
    }
}

module.exports = { buildFilterQuery: buildFilterQuery, buildQueryOptions: buildQueryOptions }