import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {Item} from 'react-native-picker-select';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';

import {
  Button,
  ErrorView,
  Loader,
  PageContainer,
  SelectInput,
  Typography,
} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import {Theme} from '@src/styles/styles';
import useAuthStore from '@src/stores/useAuthStore';
import useInternetConnection from '@src/hooks/useInternetConnection';

import useFetchHealthCheckUpQuestions from '../hooks/useFetchHealthCheckUpQuestions';
import useSaveHealthCheckUpAnswers from '../hooks/useSaveHealthCheckUpAnswers';

interface Answer {
  questionId: number;
  answerId: number;
}

const HealthCheckUpScreen = () => {
  const user = useAuthStore(state => state.user);
  const {goBack} = useNavigation();
  const {checkIfConnected} = useInternetConnection();

  const {t} = useTranslation();
  const {data, isLoading, isError, error, refetch} =
    useFetchHealthCheckUpQuestions(user?.apuId || 0);
  const {mutateAsync, isLoading: IsSavingAnswers} =
    useSaveHealthCheckUpAnswers();
  const [questions, setQuestions] = useState<any>();
  const [PreviousAnswers, setPreviousAnswers] = useState<any>();
  const [answers, setAnswers] = useState<Array<Answer>>();

  useEffect(() => {
    let items =
      data &&
      data.questions.questions300.map(question => {
        return question.mc.map(({answer, id}) => {
          return {
            label: answer,
            value: id,
          } as Item;
        });
      });
    setQuestions(items);
  }, [data]);

  const getPreviousAnswers = useCallback(() => {
    let previousAnswers =
      data &&
      data.questions.questions300.map(question => {
        return question.mc.filter(x => x.id === question.answerId)[0].answer;
      });
    setPreviousAnswers(previousAnswers);
  }, [data]);

  const initAnswers = useCallback(() => {
    let initialAnswers =
      data &&
      data.questions.questions300.map(question => {
        return {
          questionId: question.id,
          answerId: 0,
        } as Answer;
      });
    setAnswers(initialAnswers);
  }, [data]);

  useEffect(() => {
    getPreviousAnswers();
    initAnswers();
  }, [getPreviousAnswers, initAnswers]);

  const setUserAnswers = (answerId: number, questionId: number) => {
    let newAnswers =
      answers &&
      answers.map((x: Answer) =>
        x.questionId === questionId ? {questionId, answerId} : x,
      );
    setAnswers(newAnswers);
  };

  const saveAnswers = () => {
    checkIfConnected(async () => {
      if (user) {
        await mutateAsync({apuId: user?.apuId, answers: answers || []});
        refetch();
      }
    });
  };

  const appTheme = useTheme();
  const styles = makeStyles(appTheme);

  const {
    colors: {primary},
  } = appTheme;

  if (isError) {
    return <ErrorView error={error} goBack={goBack} reload={() => null} />;
  }

  if (isLoading || IsSavingAnswers) {
    return (
      <View style={styles.flex}>
        <Loader
          textColor={primary}
          indicatorColor={primary}
          text="Loading data"
        />
      </View>
    );
  }
  return (
    <PageContainer style={styles.pageContainer}>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.flex}>
        <View style={styles.headerContainer}>
          <Typography
            align="center"
            variant="h2"
            color={appTheme.colors.primary}
            text={t('healthCheckUp.title')}
          />
          <Typography align="center" variant="b1" text={data!.questions.info} />
        </View>
        <View style={styles.questionBoxContainer}>
          <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={styles.questionBoxContent}
            style={styles.questionsBox}>
            {data &&
              data.questions.questions300.map(({question, id}, index) => {
                if (questions) {
                  return (
                    <React.Fragment key={index}>
                      <SelectInput
                        value={answers && answers[index].answerId}
                        labelStyle={styles.inputLabelStyle}
                        onValueChange={value => setUserAnswers(value, id)}
                        label={question}
                        items={questions && questions[index]}
                      />
                      <Typography
                        variant="b1"
                        text={`${t('healthCheckUp.lastMeasurement')}: ${
                          PreviousAnswers[index]
                        }`}
                        fontWeight="bold"
                        color={appTheme.colors.gray}
                      />
                    </React.Fragment>
                  );
                }
              })}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={saveAnswers} text={t('common.save')} />
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    pageContainer: {
      paddingVertical: 20,
    },
    headerContainer: {
      flex: 0.25,
      justifyContent: 'space-evenly',
    },
    questionBoxContainer: {
      flex: 0.65,
    },
    questionsBox: {
      borderColor: theme.colors.lightGray,
      borderRadius: 10,
      backgroundColor: 'white',
      height: 'auto',
      paddingHorizontal: theme.spacing.horizontalPadding,
      borderWidth: 1,
    },
    questionBoxContent: {
      justifyContent: 'center',
      paddingVertical: 20,
      flexGrow: 1,
    },
    inputLabelStyle: {
      color: theme.colors.primary,
    },
    buttonContainer: {
      flex: 0.1,
      justifyContent: 'center',
    },
  });

export default HealthCheckUpScreen;
