import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { useState } from 'react'

export default function App() {
  const [query, setQuery] = useState(null)
  const [resultDatas, setResultDatas] = useState([])

  const MIN_LENGTH = 3 // min length before fetch

  // fetch query and store results to resultDatas
  const fetchQuery = async (value) => {
    setQuery(value)

    if (value.length >= MIN_LENGTH) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}&type=municipality&limit=8`)
        const data = await response.json()

        let result = []
        if (data.features) { // fetch succes
          for (let e of data.features) {
            result.push({
              name: e.properties.label,
              context: e.properties.context,
            })
          } setResultDatas(result)
        }
        else { // fetch result empty
          setResultDatas([])
        }
      }
      catch (error) { // fetch error
        console.error('error', error)
        setResultDatas([])
      }
    }
    else { // query length too short
      setResultDatas([])
    }
  }


  // set the new value of inputText and remove the results list
  const handleSelectItem = (val) => {
    setQuery(val)
    setResultDatas([])
  }

  // LIST ITEMS array
  const resultItemsList = resultDatas.map((item, i) => {
    return (
      <TouchableOpacity key={i} onPress={() => handleSelectItem(item.name)}>
        <View style={styles.floatingListItem}>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  })

  // console.log(resultDatas)

  return (
    <View style={styles.container}>
      <View style={{ margin: 30, backgroundColor: '#' }}>
        <Text style={{ color: 'cornflowerblue' }}>React Native</Text>
        <Text style={{ color: 'royalblue', fontSize: 30, marginBottom: 10, }} >Simple Autocompletion</Text>
        <Text style={{ color: '#ffffff' }}>Fetches an API and returns result as a list of items.</Text>
        <Text style={{ color: '#ffffff' }}>Select a result to set the input field value.</Text>
        <Text style={{ color: '#999999' }}>Sample below with : https://api-adresse.data.gouv.fr/search/</Text>

      </View>
      <View style={styles.formContainer}>
        <View>
          <TextInput onChangeText={value => fetchQuery(value)} value={query} style={styles.textInput} placeholder='Search ...' />
        </View>
        <View style={styles.floatingList}>
          {resultItemsList}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    color: 'royalblue',
    marginBottom: 10,
  },

  // FORM
  formContainer: {
    width: '100%',
    maxHeight: 300,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 10,
  },
  floatingList: {
    width: '100%',
    position: 'absolute',
    top: 45,
  },
  floatingListItem: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#999999',
    borderBottomWidth: 1,
    padding: 10,
  },



});
