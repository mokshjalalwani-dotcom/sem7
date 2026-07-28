library(ggplot2)
 
df <- data.frame(
  study_hours = c(2, 4, 5, 7, 8, 3, 6, 9),
  score = c(50, 58, 65, 72, 80, 55, 68, 88)
)
 
ggplot(df, aes(x = study_hours, y = score)) +
  geom_point(color = 'darkblue', size = 2) +
  geom_smooth(method = 'lm', se = FALSE, color = 'red') +
  labs(title = 'Study Hours vs Score', x = 'Study Hours', y = 'Score') +
  theme_minimal()
