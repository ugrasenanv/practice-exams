const AI900Questions = [
  {
    id: 1,
    question: "What is the primary purpose of Azure Machine Learning workspace?",
    options: [
      "To provide a centralized location for managing all assets related to machine learning projects",
      "To automatically deploy all models to production without any configuration",
      "To replace the need for data scientists in the organization completely",
      "To exclusively train neural networks without requiring any infrastructure"
    ],
    correctAnswer: 0,
    explanation: "Azure Machine Learning workspace is a centralized place to manage all machine learning assets including datasets, experiments, models, endpoints, and compute resources. It provides collaboration capabilities and tracks the entire ML lifecycle.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 2,
    question: "Which type of machine learning is used when training a model to predict house prices based on features like size, location, and number of rooms?",
    options: [
      "Unsupervised learning using clustering algorithms without labeled data",
      "Reinforcement learning with reward-based optimization strategies",
      "Supervised regression learning using labeled historical data",
      "Semi-supervised learning with partially labeled datasets"
    ],
    correctAnswer: 2,
    explanation: "Predicting continuous values like house prices is a regression problem in supervised learning. The model learns from labeled historical data (houses with known prices) to predict prices for new houses. Regression predicts numerical values, while classification predicts categories.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 3,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are common principles of Responsible AI? (Select exactly 3 answers)",
    options: [
      "Fairness - AI systems should treat all people fairly",
      "Profitability - AI systems should maximize revenue at all costs",
      "Reliability and Safety - AI systems should perform reliably and safely",
      "Privacy and Security - AI systems should be secure and respect privacy",
      "Market Dominance - AI systems should eliminate competition",
      "Exclusivity - AI systems should be accessible only to select groups"
    ],
    correctAnswers: [0, 2, 3],
    explanation: "Microsoft's Responsible AI principles include: Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, and Accountability. These ensure AI systems are ethical, trustworthy, and beneficial to society. Profitability and market dominance are business goals, not AI principles.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 4,
    question: "What is the primary difference between classification and regression in machine learning?",
    options: [
      "Classification predicts categorical labels while regression predicts continuous numerical values",
      "Classification is only used for image recognition while regression is for text analysis",
      "Classification requires more training data than regression models in all scenarios",
      "Classification models are always more accurate than regression models"
    ],
    correctAnswer: 0,
    explanation: "Classification predicts discrete categories (e.g., spam/not spam, cat/dog), while regression predicts continuous numbers (e.g., temperature, price). Both are supervised learning techniques but solve different types of problems. The choice depends on whether the target variable is categorical or numerical.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 5,
    question: "Which Azure AI service should you use to analyze sentiment in customer reviews?",
    options: [
      "Azure Computer Vision to analyze text images from reviews",
      "Azure Language Service (Text Analytics) for sentiment analysis",
      "Azure Speech Service to convert audio reviews to text",
      "Azure Form Recognizer to extract review structures"
    ],
    correctAnswer: 1,
    explanation: "Azure Language Service (formerly Text Analytics) provides sentiment analysis capabilities to determine if text expresses positive, negative, or neutral sentiment. It can analyze reviews, social media posts, and feedback at scale. Computer Vision is for images, Speech is for audio, and Form Recognizer is for document structure.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 6,
    question: "What is transfer learning in the context of machine learning?",
    options: [
      "Moving trained models between different cloud providers without retraining",
      "Using a pre-trained model as a starting point for a new related task",
      "Transferring data from on-premises storage to cloud storage",
      "Converting models between different programming languages"
    ],
    correctAnswer: 1,
    explanation: "Transfer learning involves using a pre-trained model (trained on a large dataset) as a starting point for a related task. This saves time and computational resources. For example, using a model trained on ImageNet as a base for a custom image classification task. It leverages previously learned features.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 7,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO Azure services can be used for speech recognition? (Select exactly 2 answers)",
    options: [
      "Azure Speech Service with speech-to-text capabilities",
      "Azure Cognitive Search for indexing audio files",
      "Azure Bot Service with speech channel integration",
      "Azure Language Understanding (LUIS) for text intent",
      "Azure Form Recognizer for document reading"
    ],
    correctAnswers: [0, 2],
    explanation: "Azure Speech Service provides speech-to-text (recognition) and text-to-speech capabilities. Azure Bot Service can integrate speech channels for voice interactions. Cognitive Search indexes content, LUIS understands text intent (not speech), and Form Recognizer processes documents, not speech.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 8,
    question: "What is the purpose of Azure Custom Vision service?",
    options: [
      "To provide general-purpose object detection for any scenario without training",
      "To train custom image classification and object detection models with your own images",
      "To automatically generate images based on text descriptions",
      "To enhance image quality and resolution without model training"
    ],
    correctAnswer: 1,
    explanation: "Azure Custom Vision allows you to train custom image classification and object detection models using your own labeled images. It's useful when pre-built models don't cover your specific use case. You upload images, tag them, and the service trains a model tailored to your needs.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 9,
    question: "Which metric is commonly used to evaluate classification model performance?",
    options: [
      "Mean Absolute Error (MAE) to measure average prediction error",
      "R-squared to measure proportion of variance explained",
      "Accuracy, which is the ratio of correct predictions to total predictions",
      "Root Mean Square Error (RMSE) for measuring residuals"
    ],
    correctAnswer: 2,
    explanation: "Accuracy (correct predictions / total predictions) is a common classification metric. Other classification metrics include precision, recall, and F1-score. MAE, R-squared, and RMSE are regression metrics. For imbalanced datasets, precision and recall are often more informative than accuracy alone.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 10,
    question: "What is the primary function of Azure Cognitive Search?",
    options: [
      "To train custom machine learning models for search ranking algorithms",
      "To provide AI-enriched search capabilities over your content with built-in cognitive skills",
      "To replace traditional databases with search-optimized storage solutions",
      "To automatically generate search queries from natural language descriptions"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Search provides AI-enriched search with built-in cognitive skills for OCR, entity extraction, key phrase extraction, and more. It indexes content from various sources and applies AI enrichment during indexing. This enables sophisticated search experiences over unstructured content.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 11,
    question: "What is anomaly detection in machine learning?",
    options: [
      "Identifying data points that significantly differ from the expected pattern or behavior",
      "Removing all outliers from datasets before model training",
      "Creating artificial anomalies to improve model robustness",
      "Detecting normal behavior patterns in production systems"
    ],
    correctAnswer: 0,
    explanation: "Anomaly detection identifies data points that deviate significantly from expected patterns. It's used for fraud detection, system monitoring, and quality control. Azure offers Anomaly Detector service for detecting anomalies in time-series data using unsupervised learning techniques.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 12,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are valid types of computer vision tasks? (Select exactly 3 answers)",
    options: [
      "Image Classification - categorizing images into predefined classes",
      "Natural Language Generation - creating text from images",
      "Object Detection - locating and classifying objects within images",
      "Speech Synthesis - generating audio from visual data",
      "Semantic Segmentation - classifying each pixel in an image",
      "Time Series Forecasting - predicting future image trends"
    ],
    correctAnswers: [0, 2, 4],
    explanation: "Core computer vision tasks include: Image Classification (categorizing entire images), Object Detection (finding and classifying objects with bounding boxes), and Semantic Segmentation (classifying each pixel). NLG and speech synthesis are not vision tasks. Time series forecasting is a separate ML domain.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 13,
    question: "What is the purpose of feature engineering in machine learning?",
    options: [
      "To automatically deploy trained models to production environments",
      "To create, select, or transform variables to improve model performance",
      "To engineer hardware components for faster model training",
      "To develop the graphical user interface for ML applications"
    ],
    correctAnswer: 1,
    explanation: "Feature engineering involves creating, selecting, or transforming variables (features) from raw data to improve model performance. This includes techniques like scaling, encoding categorical variables, creating interaction terms, and extracting meaningful patterns. Good features are critical for model accuracy.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 14,
    question: "Which Azure service provides pre-built REST APIs for common AI tasks without requiring custom training?",
    options: [
      "Azure Machine Learning for training custom models only",
      "Azure Cognitive Services with pre-trained models for vision, speech, language, and decision",
      "Azure Databricks for big data analytics only",
      "Azure Synapse Analytics for data warehousing only"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Services provides pre-built REST APIs for common AI tasks including Computer Vision, Speech, Language, and Decision services. These services don't require ML expertise or custom training - you can use them via simple API calls. They're ideal for common scenarios with proven models.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 15,
    question: "What is the purpose of Azure Language Understanding (LUIS)?",
    options: [
      "To translate text between multiple languages automatically",
      "To extract user intent and entities from natural language text",
      "To generate natural language responses for chatbots",
      "To perform sentiment analysis on customer reviews"
    ],
    correctAnswer: 1,
    explanation: "LUIS extracts intent (what the user wants to do) and entities (key information) from natural language text. It's used in chatbots and voice assistants to understand user requests. For example, in 'Book a flight to Seattle', it would extract intent 'BookFlight' and entity 'Seattle' as destination.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 16,
    question: "What is overfitting in machine learning?",
    options: [
      "When a model has too few parameters to learn from the data",
      "When a model learns training data too well, including noise, and performs poorly on new data",
      "When a model takes too long to train on large datasets",
      "When a model is too simple to capture patterns in the data"
    ],
    correctAnswer: 1,
    explanation: "Overfitting occurs when a model learns training data too well, including noise and outliers, resulting in poor performance on new data. The model has high accuracy on training data but low accuracy on test data. Solutions include regularization, cross-validation, and getting more training data.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 17,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are features of Azure Bot Service? (Select exactly 2 answers)",
    options: [
      "Integrates with multiple channels like Teams, Slack, and webchat",
      "Automatically generates all bot conversation logic without programming",
      "Connects to LUIS for natural language understanding",
      "Replaces all customer service representatives automatically",
      "Provides unlimited storage for conversation history"
    ],
    correctAnswers: [0, 2],
    explanation: "Azure Bot Service integrates with multiple communication channels (Teams, Slack, Facebook, etc.) and connects to LUIS for NLU capabilities. It provides the framework and infrastructure but requires you to build conversation logic. It augments but doesn't replace human agents. Storage is configurable, not unlimited.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 18,
    question: "What type of machine learning problem is detecting fraudulent transactions?",
    options: [
      "Regression problem predicting transaction amounts",
      "Clustering problem grouping similar transactions",
      "Binary classification problem predicting fraud vs legitimate",
      "Reinforcement learning problem optimizing transaction processing"
    ],
    correctAnswer: 2,
    explanation: "Fraud detection is a binary classification problem where the model predicts whether a transaction is fraudulent (positive class) or legitimate (negative class). It often deals with imbalanced datasets where fraudulent transactions are rare. Techniques like SMOTE or cost-sensitive learning may be needed.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 19,
    question: "Which Azure service enables you to build, train, and deploy machine learning models at scale?",
    options: [
      "Azure Cognitive Services for pre-built models only",
      "Azure Machine Learning for end-to-end ML lifecycle management",
      "Azure Databricks for big data processing only",
      "Azure Functions for serverless computing only"
    ],
    correctAnswer: 1,
    explanation: "Azure Machine Learning is a comprehensive platform for the entire ML lifecycle including data prep, model training, experimentation, deployment, and monitoring. It supports various frameworks (TensorFlow, PyTorch, scikit-learn), provides compute resources, and includes MLOps capabilities for production deployments.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 20,
    question: "What is the primary use case for Azure Form Recognizer?",
    options: [
      "To create and design new form layouts for data entry",
      "To extract text, key-value pairs, and tables from documents using AI",
      "To validate user input in web forms for security",
      "To translate forms between different languages"
    ],
    correctAnswer: 1,
    explanation: "Azure Form Recognizer uses AI to extract text, key-value pairs, tables, and structure from documents like invoices, receipts, and forms. It combines OCR with understanding of document layout. Prebuilt models exist for common documents, and you can train custom models for specific form types.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 21,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are examples of Azure Cognitive Services? (Select exactly 2 answers)",
    options: [
      "Azure Computer Vision for image analysis",
      "Azure Virtual Machines for compute",
      "Azure Language Understanding (LUIS) for natural language processing",
      "Azure SQL Database for data storage",
      "Azure DevOps for CI/CD pipelines"
    ],
    correctAnswers: [0, 2],
    explanation: "Azure Computer Vision and LUIS are Cognitive Services that provide AI capabilities. Virtual Machines, SQL Database, and DevOps are infrastructure and development services, not pre-built AI cognitive services.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 22,
    question: "What is transfer learning in machine learning?",
    options: [
      "Moving trained models between cloud regions",
      "Using knowledge from a pre-trained model on one task to improve performance on a related task",
      "Transferring data between different databases",
      "Converting models from one programming language to another"
    ],
    correctAnswer: 1,
    explanation: "Transfer learning involves taking a model trained on one task (e.g., general image classification) and adapting it for a related task (e.g., medical image classification). This approach requires less training data and time than building from scratch, making it highly efficient for specialized applications.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 23,
    question: "What is Azure Video Indexer used for?",
    options: [
      "Only for storing video files in the cloud",
      "To extract insights from videos including faces, keywords, sentiments, and transcripts",
      "To edit and produce professional videos",
      "To stream live video content to audiences"
    ],
    correctAnswer: 1,
    explanation: "Azure Video Indexer analyzes video content to extract rich insights: identifies people and celebrities, transcribes speech, detects topics and keywords, recognizes emotions and sentiments, identifies brands and objects, and generates thumbnails. It makes video content searchable and analyzable.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 24,
    question: "What is the difference between precision and recall in classification models?",
    options: [
      "They are the same metric with different names",
      "Precision measures how many predicted positives are correct; recall measures how many actual positives were identified",
      "Precision applies to images; recall applies to text",
      "Precision is always more important than recall"
    ],
    correctAnswer: 1,
    explanation: "Precision = True Positives / (True Positives + False Positives) - measures accuracy of positive predictions. Recall = True Positives / (True Positives + False Negatives) - measures completeness of identifying actual positives. The balance between them depends on use case: spam detection prioritizes precision, disease screening prioritizes recall.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 25,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are key capabilities of Azure Content Safety? (Select exactly 3 answers)",
    options: [
      "Detecting harmful content in text and images",
      "Automatically deleting all user accounts",
      "Identifying severity levels of inappropriate content",
      "Providing streaming video encryption",
      "Supporting content moderation workflows",
      "Mining cryptocurrency"
    ],
    correctAnswers: [0, 2, 4],
    explanation: "Azure Content Safety detects harmful content (hate speech, violence, self-harm, sexual content), assigns severity levels (0-6), and supports moderation workflows with customizable thresholds. It doesn't delete accounts automatically, provide video encryption, or mine cryptocurrency.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 26,
    question: "What is the purpose of Azure Machine Learning designer?",
    options: [
      "To design user interfaces for web applications",
      "To provide a drag-and-drop visual interface for building machine learning pipelines",
      "To create graphic designs and logos",
      "To design database schemas"
    ],
    correctAnswer: 1,
    explanation: "Azure ML designer is a visual, drag-and-drop tool for building machine learning pipelines without extensive coding. You drag datasets, transformations, and algorithms onto a canvas, connect them, and create complete ML workflows. It makes ML accessible to those with limited programming experience.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 27,
    question: "How does Azure Speech service handle multiple languages?",
    options: [
      "It only works with English",
      "It supports multiple languages for speech-to-text, text-to-speech, and translation",
      "You must create separate services for each language",
      "Multiple languages require manual configuration for each request"
    ],
    correctAnswer: 1,
    explanation: "Azure Speech service supports 100+ languages for speech-to-text and text-to-speech, with automatic language detection available. Speech translation can translate spoken language in real-time. Single service endpoints handle multiple languages with language parameter specification.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 28,
    question: "What is automated machine learning (AutoML) in Azure?",
    options: [
      "A system that automatically deploys models to production",
      "An automated process that tries multiple algorithms and hyperparameters to find the best model",
      "A tool that automatically collects training data",
      "A service that automatically monitors model performance"
    ],
    correctAnswer: 1,
    explanation: "AutoML automatically experiments with multiple algorithms, feature engineering techniques, and hyperparameters to find the best model for your data and problem. It handles data preprocessing, model selection, and optimization, making advanced ML accessible without deep expertise in algorithm selection.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 29,
    question: "What can Azure Custom Vision be used for?",
    options: [
      "Only for facial recognition applications",
      "To train custom image classification and object detection models with your own images",
      "To create artistic filters for photos",
      "To edit and enhance images professionally"
    ],
    correctAnswer: 1,
    explanation: "Azure Custom Vision allows you to train specialized image classification and object detection models using your own labeled images. Upload images, tag them, train the model, and deploy it. Useful for specialized domains like manufacturing defect detection, retail product identification, or medical imaging.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 30,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are advantages of using cloud-based AI services over on-premises solutions? (Select exactly 2 answers)",
    options: [
      "Scalability to handle varying workloads without infrastructure management",
      "Requires purchasing expensive hardware upfront",
      "Access to the latest AI models and capabilities with regular updates",
      "Complete internet independence for all operations",
      "Higher latency for all operations"
    ],
    correctAnswers: [0, 2],
    explanation: "Cloud AI services provide elastic scalability and automatic access to latest models/capabilities without hardware investments or manual updates. They don't require expensive upfront hardware purchases, but do require internet connectivity, and often provide lower latency through global distribution.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 31,
    question: "What is the purpose of Azure Metrics Advisor?",
    options: [
      "To monitor server hardware performance only",
      "To detect anomalies in time-series data and provide root cause analysis",
      "To provide metrics for code quality",
      "To measure employee productivity"
    ],
    correctAnswer: 1,
    explanation: "Azure Metrics Advisor uses AI to automatically detect anomalies in time-series data (sales, website traffic, IoT sensors, etc.), diagnose root causes, and alert stakeholders. It adapts to data patterns and seasonality, making it valuable for business monitoring and IoT scenarios.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 32,
    question: "How does Azure Language service perform sentiment analysis?",
    options: [
      "By counting positive and negative words only",
      "By analyzing text context to determine positive, negative, or neutral sentiment with confidence scores",
      "By asking human reviewers to rate the text",
      "Sentiment analysis is not available in Azure"
    ],
    correctAnswer: 1,
    explanation: "Azure Language service uses advanced NLP models to analyze text context, understanding nuance beyond keyword counting. It returns sentiment labels (positive, negative, neutral, mixed) with confidence scores at document and sentence levels. Handles negation, idioms, and contextual meaning effectively.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 33,
    question: "What is feature engineering in machine learning?",
    options: [
      "Building new hardware features for computers",
      "Creating or transforming input variables to improve model performance",
      "Adding features to software applications",
      "Engineering solutions for technical problems"
    ],
    correctAnswer: 1,
    explanation: "Feature engineering involves creating new features from existing data or transforming features to make patterns more apparent to ML algorithms. Examples: extracting day-of-week from dates, combining features, normalizing values, or creating interaction terms. Good feature engineering significantly improves model performance.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 34,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are capabilities of Azure Bot Service? (Select exactly 3 answers)",
    options: [
      "Building conversational AI interfaces",
      "Mining cryptocurrency automatically",
      "Integrating with multiple channels (Teams, Web, SMS)",
      "Natural language understanding for intent recognition",
      "Replacing all human customer service permanently",
      "Writing code in assembly language"
    ],
    correctAnswers: [0, 2, 3],
    explanation: "Azure Bot Service enables building conversational AI, supports multi-channel deployment (Teams, website, SMS, etc.), and integrates with LUIS for natural language understanding. It doesn't mine cryptocurrency, completely replace humans (augments support), or require assembly language programming.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 35,
    question: "What is the purpose of data labeling in supervised learning?",
    options: [
      "To add decorative labels to datasets",
      "To assign correct output values to training examples so the model can learn the mapping",
      "To organize files in folders",
      "To name variables in code"
    ],
    correctAnswer: 1,
    explanation: "Data labeling provides ground truth by assigning correct answers to training examples: labels for classification (cat/dog), values for regression (house prices), bounding boxes for object detection. The model learns by comparing its predictions to these labels. Quality labeling is critical for model accuracy.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 36,
    question: "How does Azure Cognitive Search enhance search capabilities?",
    options: [
      "By only providing basic text matching",
      "By using AI to extract insights, understand semantics, and provide rich search experiences with skillsets",
      "By searching only structured database content",
      "By requiring manual indexing of all content"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Search applies AI skills during indexing to extract entities, translate languages, analyze sentiment, OCR images, and more. It understands semantic search (meaning beyond keywords), supports vector search, and enables rich queries across unstructured content like documents and images.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 37,
    question: "What is the purpose of a confusion matrix in classification?",
    options: [
      "To confuse the model during training",
      "To visualize true positives, false positives, true negatives, and false negatives for evaluation",
      "To create confusion among data scientists",
      "To encrypt classification results"
    ],
    correctAnswer: 1,
    explanation: "A confusion matrix displays classification results: true positives (correctly predicted positive), false positives (incorrectly predicted positive), true negatives (correctly predicted negative), and false negatives (incorrectly predicted negative). It enables calculating precision, recall, F1-score, and understanding model error patterns.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 38,
    question: "What does Azure Face service detect in images?",
    options: [
      "Only whether a face is present or not",
      "Face location, attributes (age, emotion, accessories), and can perform face recognition and verification",
      "Only facial recognition for authentication",
      "Face detection is not available in Azure"
    ],
    correctAnswer: 1,
    explanation: "Azure Face service detects faces and returns bounding boxes, analyzes attributes (estimated age, emotion, facial hair, glasses, makeup, etc.), can identify specific people through face recognition, and verify if two faces belong to the same person. Useful for access control, demographics, and emotion analysis.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 39,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are responsibilities of AI developers and users? (Select exactly 2 answers)",
    options: [
      "Ensuring AI systems are fair and don't discriminate",
      "Using AI without any consideration of consequences",
      "Testing AI systems for potential biases and errors",
      "Sharing training data publicly without consent",
      "Ignoring privacy regulations for convenience"
    ],
    correctAnswers: [0, 2],
    explanation: "AI developers and users must ensure fairness, test for biases and errors, consider consequences, respect privacy, and comply with regulations. Ignoring impacts, sharing data without consent, and bypassing privacy rules are irresponsible and potentially illegal practices.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 40,
    question: "What is Azure Personalizer used for?",
    options: [
      "To personalize Azure portal themes",
      "To use reinforcement learning to deliver personalized content and experiences to users",
      "To create personalized email signatures",
      "To customize virtual machine configurations"
    ],
    correctAnswer: 1,
    explanation: "Azure Personalizer uses reinforcement learning to dynamically select the best content, products, or experiences for each user based on context and feedback. It learns from user interactions to continuously improve personalization. Common for content recommendations, product placement, and adaptive user experiences.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 41,
    question: "How does clustering differ from classification in machine learning?",
    options: [
      "They are identical techniques with different names",
      "Clustering is unsupervised grouping; classification is supervised prediction of predefined categories",
      "Clustering only works with images; classification only works with text",
      "Clustering is always more accurate than classification"
    ],
    correctAnswer: 1,
    explanation: "Clustering (unsupervised) discovers natural groupings in unlabeled data without predefined categories - the algorithm determines groups. Classification (supervised) predicts predefined categories using labeled training data. Different use cases: clustering for customer segmentation, classification for spam detection.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 42,
    question: "What is the purpose of Azure Document Intelligence (formerly Form Recognizer)?",
    options: [
      "To create new document templates",
      "To extract text, structure, key-value pairs, and tables from documents using AI",
      "To translate documents between languages only",
      "To delete duplicate documents"
    ],
    correctAnswer: 1,
    explanation: "Azure Document Intelligence extracts meaningful information from documents: text via OCR, structure (headings, sections), key-value pairs (Invoice #: 12345), tables, and entities. Prebuilt models handle invoices, receipts, IDs, business cards; custom models learn specific document types.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 43,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are steps in a typical machine learning workflow? (Select exactly 3 answers)",
    options: [
      "Data collection and preparation",
      "Model training and validation",
      "Ignoring model performance metrics",
      "Model deployment and monitoring",
      "Deleting all training data immediately",
      "Skipping evaluation entirely"
    ],
    correctAnswers: [0, 1, 3],
    explanation: "ML workflow includes data collection/preparation, model training/validation, and deployment/monitoring. Never ignore performance metrics, delete training data prematurely, or skip evaluation - these are critical quality and compliance steps.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 44,
    question: "What is named entity recognition (NER) in NLP?",
    options: [
      "Naming machine learning models",
      "Identifying and categorizing entities like people, organizations, locations, and dates in text",
      "Creating unique names for datasets",
      "Recognizing programming variable names"
    ],
    correctAnswer: 1,
    explanation: "NER extracts and classifies named entities from text: person names, organizations, locations, dates, quantities, monetary values, etc. Useful for information extraction, content categorization, and understanding document content. Azure Language service provides pre-built and custom NER capabilities.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 45,
    question: "How does Azure Language service perform language detection?",
    options: [
      "By asking users what language they used",
      "By analyzing text patterns to identify the language with confidence scores",
      "Language detection requires manual specification",
      "It only detects English and Spanish"
    ],
    correctAnswer: 1,
    explanation: "Azure Language service automatically detects language by analyzing text patterns, character sets, and linguistic features. Returns detected language code, name, and confidence score (0-1). Supports 120+ languages and handles mixed-language documents, returning the predominant language.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 46,
    question: "What is the purpose of validation data in machine learning?",
    options: [
      "To validate user credentials",
      "To tune hyperparameters and select the best model during training without using the test set",
      "To validate database schemas",
      "To replace the training data"
    ],
    correctAnswer: 1,
    explanation: "Validation data is a separate set used during model development to tune hyperparameters, compare models, and make architecture decisions without touching the test set. This prevents overfitting to the test data. Final model evaluation uses the test set to measure real-world performance.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 47,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are features of Azure Cognitive Services for Language? (Select exactly 2 answers)",
    options: [
      "Key phrase extraction from text",
      "3D rendering of objects",
      "Text summarization capabilities",
      "Cryptocurrency mining",
      "Video game development"
    ],
    correctAnswers: [0, 2],
    explanation: "Azure Language service offers key phrase extraction, text summarization, and many other NLP capabilities (sentiment, entities, language detection, PII). It doesn't provide 3D rendering, cryptocurrency mining, or game development - those aren't NLP workloads.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 48,
    question: "What is optical character recognition (OCR)?",
    options: [
      "A technology for recognizing hand gestures",
      "The ability to extract text from images and documents using computer vision",
      "A method for character animation in games",
      "A technique for compressing text files"
    ],
    correctAnswer: 1,
    explanation: "OCR extracts printed or handwritten text from images, scanned documents, PDFs, and photos. Azure Computer Vision's Read API provides advanced OCR with support for 100+ languages, printed and handwritten text, multiple formats, and mixed languages in single documents.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 49,
    question: "How does Azure Question Answering work?",
    options: [
      "By searching the internet randomly",
      "By creating a knowledge base from documents/FAQs and using NLP to answer questions in natural language",
      "By connecting to human operators for all questions",
      "Question answering is not available in Azure"
    ],
    correctAnswer: 1,
    explanation: "Azure Question Answering (formerly QnA Maker) creates knowledge bases from structured content (FAQs, manuals, documents). It uses NLP to understand user questions and returns relevant answers with confidence scores. Supports follow-up prompts, synonyms, and active learning to improve over time.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 50,
    question: "What is regularization in machine learning?",
    options: [
      "Making all data regular and uniform",
      "Techniques to prevent overfitting by penalizing model complexity",
      "Scheduling regular model training",
      "Creating regular patterns in data"
    ],
    correctAnswer: 1,
    explanation: "Regularization techniques (L1, L2, dropout, early stopping) prevent overfitting by penalizing overly complex models. They constrain model parameters during training, encouraging simpler models that generalize better to new data. Balances fitting training data with maintaining predictive power on unseen data.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 51,
    question: "What is the purpose of Azure Content Moderator?",
    options: [
      "To create content for websites",
      "To detect potentially inappropriate, risky, or undesirable content in text, images, and videos",
      "To moderate online meeting participants",
      "To compress content files"
    ],
    correctAnswer: 1,
    explanation: "Azure Content Moderator (part of Content Safety) detects potentially inappropriate content: profanity, adult/racy content in images, PII in text, etc. Provides severity scores and enables human review workflows. Helps platforms maintain community standards and comply with regulations.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 52,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are considerations for responsible AI deployment? (Select exactly 3 answers)",
    options: [
      "Transparency about AI capabilities and limitations",
      "Hiding how AI makes decisions from all users",
      "Accountability for AI system outcomes",
      "Ignoring user privacy concerns",
      "Fairness and avoiding harmful biases",
      "Deploying without any testing"
    ],
    correctAnswers: [0, 2, 4],
    explanation: "Responsible AI requires transparency, accountability, and fairness. Organizations must be clear about AI use, accept responsibility for outcomes, and actively work against bias. Hiding decisions, ignoring privacy, and skipping testing violate responsible AI principles.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 53,
    question: "What is the difference between batch inference and real-time inference?",
    options: [
      "They are identical deployment methods",
      "Batch processes multiple inputs together periodically; real-time processes individual inputs immediately",
      "Batch is always faster than real-time",
      "Real-time requires batch processing first"
    ],
    correctAnswer: 1,
    explanation: "Batch inference processes many predictions together on a schedule (e.g., nightly processing of customer data), optimizing throughput. Real-time inference provides immediate predictions for individual requests (e.g., fraud detection during transactions), optimizing latency. Choice depends on use case requirements.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 54,
    question: "How does Azure Translator service handle specialized vocabulary?",
    options: [
      "It cannot handle specialized terms",
      "You can create custom translation models with specialized terminology using Custom Translator",
      "Specialized vocabulary requires manual translation",
      "All translations are generic without customization"
    ],
    correctAnswer: 1,
    explanation: "Custom Translator allows training models with domain-specific terminology and parallel documents, ensuring accurate translation of specialized vocabulary for legal, medical, technical, or industry-specific content. Improves translation quality for specialized scenarios beyond general translation.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 55,
    question: "What is anomaly detection in machine learning?",
    options: [
      "Detecting errors in code",
      "Identifying data points or patterns that deviate significantly from expected behavior",
      "Finding anomalies in database schemas",
      "Detecting hardware failures only"
    ],
    correctAnswer: 1,
    explanation: "Anomaly detection identifies unusual patterns that don't conform to expected behavior: fraudulent transactions, equipment failures, network intrusions, unusual user behavior. Azure Anomaly Detector service uses ML to automatically detect anomalies in time-series data without manual threshold setting.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 56,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are characteristics of deep learning? (Select exactly 2 answers)",
    options: [
      "Uses neural networks with multiple hidden layers",
      "Requires very small amounts of training data",
      "Can automatically learn feature representations from raw data",
      "Always trains faster than traditional ML algorithms",
      "Never requires GPUs for training"
    ],
    correctAnswers: [0, 2],
    explanation: "Deep learning uses multi-layer neural networks and automatically learns feature representations from raw data. It typically requires substantial training data and computational resources (GPUs), and training time can be longer than traditional ML, but it achieves superior performance on complex tasks.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 57,
    question: "What is Azure Immersive Reader designed for?",
    options: [
      "Creating virtual reality experiences",
      "Improving reading comprehension and accessibility through features like text-to-speech and visual aids",
      "Reading hardware sensors",
      "Reading database query results"
    ],
    correctAnswer: 1,
    explanation: "Azure Immersive Reader improves reading comprehension and accessibility with features like text-to-speech, translation, grammar options, reading preferences, picture dictionary, and line focus. Helps people with dyslexia, language learners, and anyone wanting enhanced reading experiences.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 58,
    question: "What is model drift in machine learning?",
    options: [
      "Physical movement of servers hosting models",
      "Degradation of model performance over time as data patterns change",
      "Models becoming outdated due to software version changes",
      "Models moving between cloud regions"
    ],
    correctAnswer: 1,
    explanation: "Model drift occurs when real-world data patterns change after model training, causing performance degradation. Example: customer behavior changes, new product categories emerge, or seasonal patterns shift. Requires monitoring and periodic retraining with fresh data to maintain accuracy.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 59,
    question: "What can Azure Video Analyzer spatial analysis do?",
    options: [
      "Analyze space available on hard drives",
      "Detect people's positions and movements in physical spaces from video feeds",
      "Analyze audio quality in videos",
      "Edit video special effects"
    ],
    correctAnswer: 1,
    explanation: "Azure Video Analyzer spatial analysis uses AI to understand people's presence, movement, and behavior in physical spaces from video feeds: count people, detect zone entry/exit, measure social distancing, analyze queue lengths. Useful for retail analytics, workplace safety, and facility management.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 60,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are types of bias that can affect AI systems? (Select exactly 3 answers)",
    options: [
      "Selection bias in training data",
      "Confirmation bias in model design",
      "Network bandwidth bias",
      "Historical bias reflected in past data",
      "Database schema bias",
      "Color preference of the monitor"
    ],
    correctAnswers: [0, 1, 3],
    explanation: "AI systems can exhibit selection bias (non-representative training data), confirmation bias (design choices favoring expected outcomes), and historical bias (past discrimination in data). Network bandwidth, database schemas, and monitor colors don't create AI bias.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 61,
    question: "How does Azure Speaker Recognition work?",
    options: [
      "By recognizing computer speakers and audio devices",
      "By identifying or verifying speakers based on their unique voice characteristics",
      "By recognizing speech content only, not speakers",
      "Speaker recognition is not available in Azure"
    ],
    correctAnswer: 1,
    explanation: "Azure Speaker Recognition analyzes voice characteristics (pitch, tone, speech patterns) to identify who is speaking (speaker identification) or verify claimed identity (speaker verification). Useful for authentication, call center analytics, and meeting transcription attribution.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 62,
    question: "What is the purpose of a learning rate in neural network training?",
    options: [
      "To determine how fast the model processes data",
      "To control the size of weight updates during training, affecting convergence speed and stability",
      "To measure the learning ability of the model",
      "To set the duration of training time"
    ],
    correctAnswer: 1,
    explanation: "Learning rate controls how much to adjust weights based on gradient calculations. Too high: training becomes unstable, overshoots optimal solution. Too low: training is slow, may get stuck in local minima. Finding appropriate learning rate (often with scheduling) is crucial for effective training.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 63,
    question: "What is Azure Applied AI Services?",
    options: [
      "A service for submitting job applications",
      "A set of specialized AI services built on Cognitive Services for specific business scenarios",
      "A service for applying patches to software",
      "Applied AI only exists in theory, not in Azure"
    ],
    correctAnswer: 1,
    explanation: "Azure Applied AI Services are purpose-built solutions that combine multiple Cognitive Services with business logic for specific scenarios: Form Recognizer (document processing), Video Indexer (video analysis), Metrics Advisor (anomaly detection), Immersive Reader (reading enhancement), Bot Service (conversational AI).",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 64,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are benefits of using pre-built AI models? (Select exactly 2 answers)",
    options: [
      "Faster deployment without extensive ML expertise",
      "Requires training from scratch every time",
      "Lower development costs compared to custom models",
      "Always provides better accuracy than custom models",
      "Eliminates all need for testing"
    ],
    correctAnswers: [0, 2],
    explanation: "Pre-built models enable faster deployment without deep ML expertise and reduce development costs. They don't require training from scratch, but custom models may achieve better accuracy for specialized tasks. Testing is still essential to validate performance for your specific use case.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 65,
    question: "What is the purpose of extractive summarization?",
    options: [
      "To extract all text from documents",
      "To create summaries by selecting and combining key sentences from the original text",
      "To extract data from databases",
      "To summarize by generating entirely new text"
    ],
    correctAnswer: 1,
    explanation: "Extractive summarization identifies and selects the most important sentences from source text to create a summary using original wording. Contrast with abstractive summarization, which generates new text. Azure Language service provides both approaches for different use cases.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 66,
    question: "What is ensemble learning in machine learning?",
    options: [
      "Training models simultaneously on multiple computers",
      "Combining predictions from multiple models to improve overall accuracy and robustness",
      "Learning from ensemble music recordings",
      "A method for data cleaning only"
    ],
    correctAnswer: 1,
    explanation: "Ensemble learning combines multiple models (different algorithms or same algorithm with different parameters) to produce better predictions than individual models. Techniques include voting, averaging, stacking, and boosting. Random forests and gradient boosting are popular ensemble methods that often win ML competitions.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 67,
    question: "How does Azure Custom Neural Voice work?",
    options: [
      "It creates robotic-sounding voices only",
      "It creates custom synthetic voices that sound like specific speakers using neural text-to-speech",
      "It modifies existing audio recordings",
      "Custom voices are not possible in Azure"
    ],
    correctAnswer: 1,
    explanation: "Azure Custom Neural Voice creates highly natural custom synthetic voices by training neural TTS models on recordings of specific speakers. Requires voice talent consent and audio samples. Creates unique brand voices, preserves voices of individuals, or provides accessibility through personalized voice assistants.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 68,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are key performance metrics for regression models? (Select exactly 3 answers)",
    options: [
      "Mean Absolute Error (MAE)",
      "Confusion Matrix",
      "Root Mean Squared Error (RMSE)",
      "Precision and Recall",
      "R-squared (coefficient of determination)",
      "F1 Score"
    ],
    correctAnswers: [0, 2, 4],
    explanation: "Regression metrics include MAE (average absolute error), RMSE (square root of average squared errors), and R-squared (proportion of variance explained). Confusion matrix, precision/recall, and F1 score are classification metrics, not applicable to regression problems.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 69,
    question: "What is the purpose of Azure Cognitive Services containers?",
    options: [
      "To store cognitive service documentation",
      "To deploy cognitive services on-premises or at the edge while maintaining cloud connectivity for billing",
      "Containers are not supported for cognitive services",
      "To package training data only"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Services containers enable deploying services (Computer Vision, Language, Speech, etc.) in on-premises datacenters, edge locations, or other clouds. Provides data residency, low latency, and compliance benefits while maintaining cloud connectivity for billing and updates.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 70,
    question: "What is conversational language understanding (CLU)?",
    options: [
      "Understanding conversation etiquette in business",
      "An AI capability to understand user intent and extract entities from natural language in conversational contexts",
      "A communication training program",
      "Understanding programming language syntax"
    ],
    correctAnswer: 1,
    explanation: "CLU (evolution of LUIS) uses ML to understand user intent and extract entities from conversational text. Example: 'Book a flight to Seattle tomorrow' → intent: BookFlight, entities: destination=Seattle, date=tomorrow. Essential for building natural conversational interfaces in bots and applications.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 71,
    question: "What is the purpose of cross-validation in machine learning?",
    options: [
      "To validate user inputs in forms",
      "To assess model performance more reliably by training and testing on different data subsets",
      "To check for data corruption",
      "To validate database constraints"
    ],
    correctAnswer: 1,
    explanation: "Cross-validation (k-fold CV) splits data into k subsets, trains on k-1 subsets and tests on remaining subset, repeating for each combination. Provides more robust performance estimates than single train/test split, reduces variance in evaluation, and helps detect overfitting.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 72,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are examples of computer vision applications? (Select exactly 2 answers)",
    options: [
      "Detecting defects in manufacturing products",
      "Predicting stock prices",
      "Identifying plant diseases from leaf images",
      "Forecasting weather patterns",
      "Calculating loan interest rates"
    ],
    correctAnswers: [0, 2],
    explanation: "Computer vision applications include defect detection (analyzing product images) and plant disease identification (analyzing leaf images). Stock prediction, weather forecasting, and loan calculations use other ML techniques but not computer vision.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 73,
    question: "What is Azure OpenAI Service?",
    options: [
      "A service for opening files in Azure",
      "Azure's offering providing REST API access to OpenAI's powerful language models including GPT-4",
      "An open-source AI development tool",
      "A service for opening customer service tickets"
    ],
    correctAnswer: 1,
    explanation: "Azure OpenAI Service provides REST API access to OpenAI's advanced models (GPT-4, GPT-3.5, Codex, DALL-E, Embeddings) with enterprise-grade security, compliance, and regional availability of Azure. Enables building sophisticated generative AI applications with Azure's infrastructure and Microsoft's responsible AI practices.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 74,
    question: "What is the difference between supervised and reinforcement learning?",
    options: [
      "They are identical learning approaches",
      "Supervised learns from labeled examples; reinforcement learns from rewards and penalties through interaction",
      "Supervised is always better than reinforcement learning",
      "Reinforcement learning requires supervision at all times"
    ],
    correctAnswer: 1,
    explanation: "Supervised learning trains on labeled input-output pairs. Reinforcement learning trains an agent to make sequential decisions by receiving rewards or penalties for actions, learning optimal strategies through trial and error. RL suits game playing, robotics, autonomous systems; supervised learning suits classification and regression.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 75,
    question: "How does Azure Language service handle personally identifiable information (PII)?",
    options: [
      "It cannot detect PII in text",
      "It detects and redacts PII entities like names, addresses, phone numbers, and account numbers",
      "PII detection requires manual review only",
      "It shares all PII with third parties"
    ],
    correctAnswer: 1,
    explanation: "Azure Language service PII detection identifies sensitive entities (names, addresses, SSNs, credit cards, emails, phone numbers, etc.) in text and can redact them. Essential for compliance with GDPR, CCPA, and other privacy regulations when processing documents and communications.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 76,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are considerations when choosing between custom and pre-built AI models? (Select exactly 3 answers)",
    options: [
      "Development time and resources available",
      "Always choose custom models regardless of need",
      "Specificity of your use case and requirements",
      "Never use pre-built models under any circumstances",
      "Available training data quality and quantity",
      "Ignoring accuracy requirements"
    ],
    correctAnswers: [0, 2, 4],
    explanation: "Model choice depends on development resources, use case specificity, and training data availability. Pre-built models work well for general tasks with limited data/time. Custom models suit specialized needs with sufficient quality training data. Don't ignore accuracy or dogmatically choose one approach.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 77,
    question: "What is the purpose of Azure Machine Learning compute instances?",
    options: [
      "To store machine learning models only",
      "To provide cloud-based development environments with pre-installed ML tools and libraries",
      "To compute mathematical equations",
      "To instance virtual machines for general purposes"
    ],
    correctAnswer: 1,
    explanation: "Azure ML compute instances are managed cloud workstations with pre-installed ML frameworks (PyTorch, TensorFlow, scikit-learn), Jupyter notebooks, VS Code integration, and terminal access. Provide scalable development environments without managing infrastructure, enabling data scientists to focus on model development.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 78,
    question: "What is text analytics in NLP?",
    options: [
      "Analyzing text file sizes and formats",
      "Extracting insights from text including sentiment, entities, key phrases, and language",
      "Analyzing text editor performance",
      "Counting words in documents"
    ],
    correctAnswer: 1,
    explanation: "Text analytics applies NLP to extract meaningful insights: sentiment analysis, named entity recognition, key phrase extraction, language detection, PII detection, and text summarization. Azure Language service provides comprehensive text analytics capabilities for understanding and organizing text content.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 79,
    question: "What is gradient descent in machine learning?",
    options: [
      "A technique for organizing file systems",
      "An optimization algorithm that iteratively adjusts model parameters to minimize loss function",
      "A method for grading student performance",
      "A way to decrease data storage requirements"
    ],
    correctAnswer: 1,
    explanation: "Gradient descent is the fundamental optimization algorithm for training ML models. It calculates gradients (derivatives) of the loss function with respect to parameters, then updates parameters in the direction that reduces loss. Variants include stochastic gradient descent (SGD), mini-batch gradient descent, and Adam optimizer.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 80,
    question: "How does Azure Cognitive Search support vector search?",
    options: [
      "Vector search is not available in Azure",
      "It enables semantic search using embeddings to find similar content based on meaning, not just keywords",
      "It only searches for mathematical vectors",
      "Vector search works only with images, not text"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Search vector search uses embeddings (dense numerical representations) to enable semantic similarity search. Finds content similar in meaning even without keyword matches. Combines with hybrid search (keywords + vectors) for powerful retrieval. Essential for RAG (Retrieval Augmented Generation) patterns.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 81,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are ethical considerations specific to facial recognition technology? (Select exactly 2 answers)",
    options: [
      "Potential for surveillance and privacy violations",
      "Energy consumption of servers",
      "Accuracy disparities across different demographic groups",
      "Cost of cloud storage",
      "Network bandwidth requirements"
    ],
    correctAnswers: [0, 2],
    explanation: "Facial recognition raises significant ethical concerns about surveillance/privacy and accuracy disparities across race, gender, and age groups (algorithmic bias). While server energy, storage costs, and bandwidth are practical considerations, they're not facial recognition-specific ethical issues.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 82,
    question: "What is the purpose of Azure Machine Learning pipelines?",
    options: [
      "To transport data between buildings",
      "To create reproducible workflows that orchestrate ML tasks from data prep through model deployment",
      "To manage water pipes in datacenters",
      "To organize code files in folders"
    ],
    correctAnswer: 1,
    explanation: "Azure ML pipelines define reproducible workflows that orchestrate ML tasks: data ingestion, preprocessing, feature engineering, training, evaluation, and deployment. Enable automation, sharing, versioning, and scheduling of ML workflows. Support CI/CD for ML (MLOps) and collaborative development.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 83,
    question: "What is intent recognition in conversational AI?",
    options: [
      "Recognizing the file format of user input",
      "Determining what the user wants to accomplish from their natural language input",
      "Identifying whether users are telling the truth",
      "Recognizing user authentication credentials"
    ],
    correctAnswer: 1,
    explanation: "Intent recognition determines the user's goal from conversational input. Example: 'I want to book a flight' → BookFlight intent. CLU/LUIS models learn to classify utterances into intents through training examples. Accurate intent recognition is fundamental for effective conversational interfaces and bot functionality.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 84,
    question: "What is the purpose of model explainability in AI?",
    options: [
      "To make models run faster",
      "To understand and interpret how models make decisions, building trust and enabling debugging",
      "To explain AI concepts to beginners",
      "To create user documentation for models"
    ],
    correctAnswer: 1,
    explanation: "Model explainability (interpretability) helps understand why models make specific predictions: which features are most important, how they influence outcomes. Critical for trust, regulatory compliance, debugging errors, and identifying bias. Azure ML provides explainability tools for understanding model behavior.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 85,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are components of a conversational AI solution? (Select exactly 3 answers)",
    options: [
      "Natural language understanding for intent recognition",
      "Physical robot hardware",
      "Dialog management to maintain conversation context",
      "Random response generation without context",
      "Response generation to create appropriate replies",
      "Cryptocurrency mining capabilities"
    ],
    correctAnswers: [0, 2, 4],
    explanation: "Conversational AI requires NLU (understanding intent/entities), dialog management (tracking context, managing conversation flow), and response generation (creating appropriate replies). Physical robots, random responses, and cryptocurrency mining aren't core conversational AI components.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 86,
    question: "What is Azure Databricks used for in AI/ML?",
    options: [
      "Only for storing bricks and mortar inventory data",
      "As a collaborative Apache Spark-based analytics platform for big data processing and ML at scale",
      "For building physical data structures",
      "Databricks is not related to AI or ML"
    ],
    correctAnswer: 1,
    explanation: "Azure Databricks provides a collaborative Apache Spark-based platform for large-scale data engineering and ML. Offers notebooks, automated cluster management, MLflow integration, and optimized Spark for processing massive datasets and training models at scale. Popular for production ML workflows.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 87,
    question: "How does Azure Speech service handle real-time translation?",
    options: [
      "Real-time translation is not available",
      "It provides real-time speech-to-speech translation by combining speech recognition, translation, and synthesis",
      "Translation requires batch processing only",
      "Real-time translation works only with text input"
    ],
    correctAnswer: 1,
    explanation: "Azure Speech service real-time speech translation recognizes spoken language, translates to target language(s), and optionally synthesizes speech in target language - all in near real-time. Enables multilingual conversations, live captions, and interpretation scenarios with low latency.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 88,
    question: "What is the purpose of a loss function in machine learning?",
    options: [
      "To calculate financial losses in business",
      "To measure how far model predictions are from actual values, guiding training optimization",
      "To track data losses due to system failures",
      "To measure weight loss in health applications"
    ],
    correctAnswer: 1,
    explanation: "Loss functions (cost functions) quantify prediction error: how far predictions deviate from true values. Training optimizes parameters to minimize loss. Examples: mean squared error for regression, cross-entropy for classification. Choice of loss function significantly impacts what the model learns.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 89,
    question: "What is Azure Machine Learning responsible AI dashboard?",
    options: [
      "A dashboard for tracking model training costs",
      "A tool providing insights into model fairness, explainability, and error analysis",
      "A dashboard for monitoring server health",
      "A tool for managing user access permissions"
    ],
    correctAnswer: 1,
    explanation: "Azure ML Responsible AI dashboard provides comprehensive tools for assessing model fairness across demographic groups, explaining model decisions, analyzing error patterns, and understanding causality. Helps identify and mitigate bias, improve model transparency, and ensure responsible AI deployment.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 90,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are benefits of using neural networks for complex problems? (Select exactly 2 answers)",
    options: [
      "Ability to learn non-linear patterns and relationships",
      "Always require minimal training data",
      "Automatic feature learning from raw data",
      "Guaranteed instant training completion",
      "Never require any hyperparameter tuning"
    ],
    correctAnswers: [0, 2],
    explanation: "Neural networks excel at learning non-linear patterns and automatically discovering feature representations. However, they typically require substantial training data, significant training time, and careful hyperparameter tuning. They're powerful but not magic solutions requiring no effort.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 91,
    question: "What is the purpose of Azure Machine Learning model registry?",
    options: [
      "To register users for Azure ML services",
      "To version, organize, and manage trained models with metadata and lineage tracking",
      "To register domain names for ML applications",
      "To count the number of models created"
    ],
    correctAnswer: 1,
    explanation: "Azure ML model registry provides centralized version control and management for trained models. Stores models with metadata (performance metrics, training parameters), tracks lineage (which data and code created it), enables comparison of versions, and facilitates deployment. Essential for ML governance and MLOps.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 92,
    question: "How does conversational AI handle multi-turn dialogs?",
    options: [
      "It treats each user input independently without context",
      "It maintains conversation state and context across multiple turns to enable coherent exchanges",
      "Multi-turn conversations are not supported",
      "It restarts the conversation after every response"
    ],
    correctAnswer: 1,
    explanation: "Conversational AI maintains dialog state across multiple turns, tracking context, previous intents, entities, and user preferences. This enables natural multi-turn conversations: follow-up questions, clarifications, and progressive information gathering without repeating context each turn.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 93,
    question: "What is the purpose of confidence scores in AI predictions?",
    options: [
      "To measure user confidence in the AI system",
      "To indicate how certain the model is about each prediction, enabling appropriate action based on certainty",
      "To score employee confidence levels",
      "To calculate financial confidence intervals"
    ],
    correctAnswer: 1,
    explanation: "Confidence scores (typically 0-1 or percentages) indicate model certainty in predictions. High confidence suggests reliable predictions; low confidence suggests uncertainty requiring human review. Enables building systems with appropriate automation: auto-approve high confidence, human review low confidence cases.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 94,
    questionType: "multiple",
    selectCount: 3,
    question: "Which THREE are typical stages in an ML model lifecycle? (Select exactly 3 answers)",
    options: [
      "Data collection and preparation",
      "Model training and evaluation",
      "Ignoring model performance in production",
      "Model deployment and serving",
      "Deleting all documentation",
      "Skipping testing entirely"
    ],
    correctAnswers: [0, 1, 3],
    explanation: "ML lifecycle includes data preparation, model training/evaluation, and deployment/serving. Additionally includes monitoring and retraining. Never ignore production performance, delete documentation, or skip testing - these are critical for reliable ML systems.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 95,
    question: "What is prompt engineering in the context of large language models?",
    options: [
      "Engineering prompts for hardware systems",
      "Crafting effective input instructions to guide language models toward desired outputs",
      "Prompting users to upgrade their software",
      "Engineering hardware for faster processing"
    ],
    correctAnswer: 1,
    explanation: "Prompt engineering is the practice of designing effective prompts for language models (like GPT-4). Involves crafting clear instructions, providing examples (few-shot learning), specifying output format, and iterating to improve results. Critical skill for leveraging large language models effectively in applications.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 96,
    question: "How does Azure Custom Vision handle small training datasets?",
    options: [
      "It requires millions of images to work",
      "It uses transfer learning and can create useful models with as few as 30 images per class",
      "Small datasets are not supported",
      "It automatically generates synthetic training data"
    ],
    correctAnswer: 1,
    explanation: "Azure Custom Vision leverages transfer learning from pre-trained models, enabling effective training with relatively small datasets (30+ images per class recommended). The base model already understands general visual features; custom training specializes it for your specific categories efficiently.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 97,
    question: "What is the purpose of Azure Machine Learning endpoints?",
    options: [
      "To mark the end of training processes",
      "To provide REST API interfaces for deployed models, enabling real-time or batch inference",
      "To determine project completion dates",
      "To identify network connection termination points"
    ],
    correctAnswer: 1,
    explanation: "Azure ML endpoints provide REST API access to deployed models. Managed online endpoints serve real-time predictions with authentication, scaling, and monitoring. Batch endpoints process large datasets asynchronously. Endpoints abstract model hosting, making integration simple for application developers.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 98,
    questionType: "multiple",
    selectCount: 2,
    question: "Which TWO are considerations for AI model monitoring in production? (Select exactly 2 answers)",
    options: [
      "Tracking prediction accuracy and performance metrics",
      "Never checking model behavior after deployment",
      "Detecting data drift and model degradation",
      "Ignoring user feedback completely",
      "Disabling all logging to save costs"
    ],
    correctAnswers: [0, 2],
    explanation: "Production monitoring requires tracking performance metrics and detecting data drift/degradation. Never ignore post-deployment behavior, user feedback, or disable logging - these are essential for maintaining model quality, identifying issues, and continuous improvement.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 99,
    question: "What is the difference between abstractive and extractive summarization?",
    options: [
      "They produce identical summaries",
      "Abstractive generates new text; extractive selects existing sentences from source",
      "Abstractive is always shorter than extractive",
      "Extractive only works with abstract documents"
    ],
    correctAnswer: 1,
    explanation: "Extractive summarization selects and combines important sentences from original text without creating new wording. Abstractive summarization generates new text that captures key information, potentially using different words than the source. Abstractive is more flexible but more complex; extractive guarantees accuracy of selected sentences.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 100,
    question: "What is the overall goal of Azure AI services?",
    options: [
      "To replace all human workers with AI",
      "To democratize AI by providing accessible, pre-built capabilities that solve real business problems",
      "To make AI as complex as possible",
      "To create AI only for large enterprises"
    ],
    correctAnswer: 1,
    explanation: "Azure AI democratizes artificial intelligence by providing accessible, pre-built services that don't require deep ML expertise. Enables organizations of all sizes to solve real business problems with computer vision, NLP, speech, decision-making, and search capabilities. Focus is on practical value and responsible AI.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 101,
    question: "What is the purpose of Azure Machine Learning pipelines?",
    options: [
      "To physically transport data between servers",
      "To orchestrate and automate machine learning workflows with reusable steps",
      "To clean water in data centers",
      "To manually process each ML task"
    ],
    correctAnswer: 1,
    explanation: "Azure ML pipelines orchestrate machine learning workflows by connecting reusable steps for data preparation, training, validation, and deployment. Pipelines enable automation, reproducibility, parallel execution, and efficient management of complex ML workflows.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 102,
    question: "How does Azure Cognitive Search use AI enrichment?",
    options: [
      "It only performs basic keyword matching",
      "It applies AI skills like OCR, entity recognition, and sentiment analysis to enhance searchable content",
      "It replaces all manual search operations",
      "It only works with structured data"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Search uses AI enrichment to extract information from unstructured content through skills like OCR for images, entity recognition, key phrase extraction, language detection, sentiment analysis, and custom skills. This makes content more searchable and insights more accessible.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 103,
    question: "What is the difference between face detection and face recognition?",
    options: [
      "They are identical capabilities",
      "Detection identifies that a face exists; recognition identifies whose face it is",
      "Detection is more advanced than recognition",
      "Recognition only counts faces"
    ],
    correctAnswer: 1,
    explanation: "Face detection identifies the presence and location of human faces in images. Face recognition goes further by identifying whose face it is by comparing against a database of known faces. Detection is a prerequisite for recognition.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 104,
    question: "What is transfer learning in machine learning?",
    options: [
      "Transferring data between storage accounts",
      "Using a pre-trained model as a starting point for a related task",
      "Moving models to production",
      "Converting between programming languages"
    ],
    correctAnswer: 1,
    explanation: "Transfer learning leverages a model pre-trained on one task as a starting point for a related task. This is especially valuable when you have limited training data, as the model already learned useful features from its original training on larger datasets.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 105,
    question: "How does Azure Speech service handle custom vocabulary?",
    options: [
      "It cannot learn new terms",
      "Custom Speech allows training on domain-specific terms, phrases, and pronunciations",
      "It only works with common words",
      "Vocabulary cannot be customized"
    ],
    correctAnswer: 1,
    explanation: "Custom Speech in Azure Speech service allows training models with domain-specific vocabulary, industry jargon, product names, and unique pronunciations. This improves accuracy for specialized scenarios like medical, legal, or technical domains.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 106,
    question: "What is the purpose of anomaly detection in AI?",
    options: [
      "To create anomalies in data",
      "To identify unusual patterns, outliers, or unexpected events in data",
      "To normalize all data points",
      "To remove all unique values"
    ],
    correctAnswer: 1,
    explanation: "Anomaly detection identifies data points, patterns, or events that deviate significantly from expected behavior. Used for fraud detection, equipment monitoring, quality control, cybersecurity, and identifying issues requiring investigation.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 107,
    question: "What is the role of feature engineering in machine learning?",
    options: [
      "Designing user interface features",
      "Selecting, creating, and transforming input variables to improve model performance",
      "Adding new product features",
      "Engineering has no role in ML"
    ],
    correctAnswer: 1,
    explanation: "Feature engineering involves selecting relevant variables, creating new features from existing data, transforming features for better model performance, and encoding categorical variables. Good feature engineering often improves model accuracy more than algorithm choice.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 108,
    question: "How does Azure Form Recognizer handle custom forms?",
    options: [
      "It only works with pre-built form types",
      "Custom models can be trained on your specific forms with as few as five examples",
      "Custom forms require thousands of training examples",
      "Form structure cannot be learned"
    ],
    correctAnswer: 1,
    explanation: "Azure Form Recognizer allows training custom models on your organization's specific forms with as few as five examples. It learns the structure and can extract key-value pairs, tables, and specific fields from similar forms automatically.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 109,
    question: "What is the difference between synchronous and asynchronous AI operations?",
    options: [
      "They produce different results",
      "Synchronous waits for completion; asynchronous processes in background and returns results later",
      "Synchronous is always faster",
      "There is no practical difference"
    ],
    correctAnswer: 1,
    explanation: "Synchronous operations wait for completion before returning (suitable for quick tasks). Asynchronous operations start processing, return immediately, and provide results later (suitable for long-running tasks like batch processing or video analysis). Choice depends on use case and response time requirements.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 110,
    question: "What is the purpose of the confusion matrix in classification?",
    options: [
      "To confuse machine learning practitioners",
      "To visualize true positives, false positives, true negatives, and false negatives",
      "To make predictions more difficult",
      "To encrypt model results"
    ],
    correctAnswer: 1,
    explanation: "A confusion matrix visualizes classification model performance by showing true positives (correct positive predictions), false positives (incorrect positive predictions), true negatives (correct negative predictions), and false negatives (incorrect negative predictions). Essential for understanding model strengths and weaknesses.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 111,
    question: "How do chatbots typically handle conversations they weren't trained for?",
    options: [
      "They make up random responses",
      "They use fallback responses and may escalate to human agents",
      "They crash and restart",
      "They ignore the user completely"
    ],
    correctAnswer: 1,
    explanation: "Well-designed chatbots use fallback responses when they don't understand a query, may request clarification, suggest alternative questions, or escalate to human agents for complex issues. Graceful handling of unknown scenarios is crucial for user experience.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 112,
    question: "What is data drift in machine learning models?",
    options: [
      "Physical movement of data storage",
      "Changes in data patterns over time that can degrade model performance",
      "Loss of training data",
      "Intentional modification of datasets"
    ],
    correctAnswer: 1,
    explanation: "Data drift occurs when the statistical properties of input data change over time, causing model performance to degrade. Monitoring for drift and retraining models with current data is essential for maintaining accuracy in production.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 113,
    question: "What is the purpose of speech synthesis markup language (SSML)?",
    options: [
      "To write code for speech models",
      "To control pronunciation, pitch, rate, volume, and other speech characteristics",
      "To transcribe audio files",
      "To compress audio data"
    ],
    correctAnswer: 1,
    explanation: "SSML (Speech Synthesis Markup Language) is an XML-based markup language that provides fine-grained control over speech synthesis. You can adjust pronunciation, speaking rate, pitch, volume, pauses, emphasis, and voice characteristics for more natural text-to-speech output.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 114,
    question: "What is object detection in computer vision?",
    options: [
      "Detecting objects with physical sensors",
      "Identifying and locating multiple objects within an image with bounding boxes",
      "Counting all pixels in an image",
      "Determining image file format"
    ],
    correctAnswer: 1,
    explanation: "Object detection identifies multiple objects in an image, classifies each object type, and provides bounding box coordinates showing where each object is located. Unlike image classification (whole image) or segmentation (pixel-level), object detection locates and labels multiple objects.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 115,
    question: "What are the key benefits of using pre-built AI models?",
    options: [
      "They offer unlimited customization",
      "Faster deployment, lower costs, and no need for large training datasets",
      "They always outperform custom models",
      "They require extensive ML expertise"
    ],
    correctAnswer: 1,
    explanation: "Pre-built AI models offer faster time-to-value, lower development costs, no need for large training datasets or ML expertise, and proven capabilities for common scenarios. Trade-off is less customization compared to training custom models from scratch.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 116,
    question: "How does batch processing differ from real-time processing in AI?",
    options: [
      "Batch is always slower",
      "Batch processes multiple items together; real-time processes immediately as requests arrive",
      "Batch requires more storage",
      "Real-time always costs more"
    ],
    correctAnswer: 1,
    explanation: "Batch processing handles multiple items together on a schedule, optimizing for throughput and cost. Real-time processing responds immediately to individual requests, optimizing for latency. Choice depends on business requirements, acceptable latency, and cost considerations.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 117,
    question: "What is the purpose of language understanding (LUIS) in conversational AI?",
    options: [
      "To translate between languages",
      "To extract intent and entities from natural language user input",
      "To generate responses automatically",
      "To correct grammar mistakes"
    ],
    correctAnswer: 1,
    explanation: "Language Understanding (LUIS) extracts meaning from natural language by identifying user intent (what they want to do) and entities (relevant information like dates, locations, names). This enables applications to understand and respond to user requests appropriately.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 118,
    question: "What is semantic segmentation in computer vision?",
    options: [
      "Segmenting text by meaning",
      "Classifying every pixel in an image to identify regions and objects",
      "Dividing images into equal parts",
      "Removing background from images"
    ],
    correctAnswer: 1,
    explanation: "Semantic segmentation classifies every pixel in an image, assigning each pixel to a category (e.g., road, sky, person, vehicle). Provides detailed understanding of image content at pixel level, useful for autonomous vehicles, medical imaging, and scene understanding.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 119,
    question: "What is the role of confidence scores in AI predictions?",
    options: [
      "To increase user confidence",
      "To indicate how certain the model is about each prediction",
      "To score model complexity",
      "To rate data quality"
    ],
    correctAnswer: 1,
    explanation: "Confidence scores (typically 0-1 or 0-100%) indicate the model's certainty about predictions. Higher scores suggest greater confidence. Applications can use thresholds to filter low-confidence predictions, route uncertain cases to humans, or adjust responses based on confidence levels.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 120,
    question: "How does Azure Custom Vision differ from Computer Vision service?",
    options: [
      "They are identical services",
      "Custom Vision allows training models on your specific images; Computer Vision provides pre-trained models",
      "Computer Vision only works with custom images",
      "Custom Vision is more expensive"
    ],
    correctAnswer: 1,
    explanation: "Azure Computer Vision provides pre-trained models for general image analysis. Azure Custom Vision allows you to train your own classification or object detection models on your specific images and categories, useful for specialized scenarios not covered by pre-built models.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 121,
    question: "What is knowledge mining in Azure Cognitive Search?",
    options: [
      "Mining cryptocurrency with knowledge",
      "Extracting insights and structure from unstructured content using AI",
      "Physical extraction of data from servers",
      "Memorizing all search queries"
    ],
    correctAnswer: 1,
    explanation: "Knowledge mining uses AI to extract insights, entities, relationships, and structure from unstructured content like documents, images, and media files. Azure Cognitive Search applies cognitive skills to make previously hidden information searchable and actionable.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 122,
    question: "What is the difference between multi-class and multi-label classification?",
    options: [
      "They are the same thing",
      "Multi-class assigns one category; multi-label can assign multiple categories to same item",
      "Multi-label is always more accurate",
      "Multi-class requires more training data"
    ],
    correctAnswer: 1,
    explanation: "Multi-class classification assigns exactly one category from multiple options (e.g., cat, dog, or bird). Multi-label classification can assign multiple categories to the same item (e.g., an image might be labeled both 'beach' and 'sunset'). Different problem types requiring different approaches.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 123,
    question: "How does Azure Translator handle document translation?",
    options: [
      "It only translates plain text",
      "It can translate entire documents while preserving formatting and structure",
      "Documents must be converted to text first",
      "Translation removes all formatting"
    ],
    correctAnswer: 1,
    explanation: "Azure Translator's document translation capability can translate entire documents (Word, PDF, PowerPoint, etc.) while preserving original formatting, layout, and structure. Useful for translating business documents, presentations, and formatted content at scale.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 124,
    question: "What is model interpretability in machine learning?",
    options: [
      "Making models run faster",
      "Understanding and explaining how models make predictions",
      "Translating models to different languages",
      "Making models smaller"
    ],
    correctAnswer: 1,
    explanation: "Model interpretability (explainability) helps humans understand why models make specific predictions. Important for trust, debugging, regulatory compliance, and ensuring fairness. Techniques include feature importance, SHAP values, and decision visualizations.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 125,
    question: "What is the purpose of speech translation in Azure Speech service?",
    options: [
      "To translate text documents",
      "To translate spoken audio from one language to another in real-time",
      "To transcribe speech to text only",
      "To change voice characteristics"
    ],
    correctAnswer: 1,
    explanation: "Speech translation in Azure Speech service provides real-time translation of spoken audio from one language to another. Can output translated speech or text, enabling multilingual conversations, content localization, and international communication scenarios.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 126,
    question: "Which Azure services are commonly used together for a conversational AI solution? (Select TWO)",
    options: [
      "Language Understanding (LUIS)",
      "Azure Blockchain",
      "QnA Maker (Question Answering)",
      "Azure DNS",
      "Azure Load Balancer"
    ],
    correctAnswer: [0, 2],
    explanation: "Conversational AI solutions typically combine Language Understanding (LUIS) for intent recognition and entity extraction with QnA Maker/Question Answering for knowledge base responses. Bot Service orchestrates the conversation flow, and Speech services can add voice capabilities.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 127,
    question: "What are key considerations when deploying ML models to production? (Select THREE)",
    options: [
      "Performance and latency requirements",
      "Ignoring security concerns",
      "Monitoring and logging",
      "Avoiding all testing",
      "Scalability and cost",
      "Removing all documentation"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Production deployment requires considering: performance/latency SLAs, comprehensive monitoring and logging for health and drift, and scalability/cost management. Also important: security, testing, rollback plans, and documentation. Never ignore security, skip testing, or remove documentation.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 128,
    question: "Which are valid use cases for computer vision? (Select THREE)",
    options: [
      "Quality control in manufacturing",
      "Predicting stock prices",
      "Medical image analysis",
      "Text sentiment analysis",
      "Autonomous vehicle navigation",
      "Email spam filtering"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Computer vision use cases include: quality control (detecting defects in products), medical image analysis (identifying conditions in X-rays, MRIs), and autonomous vehicle navigation (identifying objects, lanes, signs). Stock prediction, sentiment analysis, and spam filtering use other AI techniques.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 129,
    question: "What are characteristics of responsible AI? (Select THREE)",
    options: [
      "Fairness and inclusiveness",
      "Maximum complexity",
      "Reliability and safety",
      "Opacity and secrecy",
      "Privacy and security",
      "Avoiding all oversight"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Responsible AI principles include: fairness and inclusiveness (equitable treatment), reliability and safety (consistent, secure operation), and privacy and security (data protection). Also includes transparency and accountability. Complexity, opacity, and avoiding oversight contradict responsible AI.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 130,
    question: "Which NLP tasks can Azure Cognitive Services for Language perform? (Select THREE)",
    options: [
      "Entity recognition",
      "Image classification",
      "Sentiment analysis",
      "Object detection",
      "Key phrase extraction",
      "Face recognition"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Azure Cognitive Services for Language handles NLP tasks: entity recognition (identifying people, places, organizations), sentiment analysis (positive/negative/neutral), and key phrase extraction (main topics). Image classification, object detection, and face recognition are computer vision tasks.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 131,
    question: "What factors affect ML model training time? (Select TWO)",
    options: [
      "Dataset size and complexity",
      "Model name",
      "Algorithm and compute resources",
      "Day of the week",
      "Font used in code"
    ],
    correctAnswer: [0, 2],
    explanation: "Training time depends on: dataset size and complexity (more data takes longer), and algorithm choice plus compute resources (complex algorithms need more processing; better hardware trains faster). Model name, day of week, and code formatting don't affect training time.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 132,
    question: "Which are benefits of Azure Machine Learning workspace? (Select THREE)",
    options: [
      "Centralized asset management",
      "Automatic code writing",
      "Collaboration capabilities",
      "Eliminating all human involvement",
      "Experiment tracking and versioning",
      "Guaranteed model accuracy"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Azure ML workspace benefits: centralized management of datasets, models, and experiments; collaboration features for teams; experiment tracking and versioning for reproducibility. It doesn't write code automatically, eliminate humans, or guarantee accuracy - those require human expertise.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 133,
    question: "What are valid applications of speech services? (Select THREE)",
    options: [
      "Virtual assistants and voice commands",
      "Image classification",
      "Call center transcription and analysis",
      "Object detection",
      "Accessibility features for visually impaired",
      "Network routing"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Speech service applications: virtual assistants and voice commands (speech recognition), call center transcription and analytics (speech-to-text with sentiment analysis), and accessibility features like screen readers (text-to-speech). Image classification and object detection use computer vision.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 134,
    question: "Which scenarios benefit from anomaly detection? (Select TWO)",
    options: [
      "Fraud detection in transactions",
      "Normal data classification",
      "Equipment failure prediction",
      "Routine report generation",
      "Standard data validation"
    ],
    correctAnswer: [0, 2],
    explanation: "Anomaly detection excels at: identifying fraudulent transactions that deviate from normal patterns, and predicting equipment failures by detecting unusual sensor readings. It's specifically for finding outliers, not handling normal classification, routine processes, or standard validation.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 135,
    question: "What are components of a typical bot architecture? (Select THREE)",
    options: [
      "Bot Service for orchestration",
      "Physical robots",
      "Language Understanding for intent",
      "Database for conversation history",
      "Quantum computing",
      "Holographic displays"
    ],
    correctAnswer: [0, 2, 3],
    explanation: "Bot architecture typically includes: Bot Service/Framework for orchestration and channel management, Language Understanding for intent recognition, and database for storing conversation state and history. Physical robots, quantum computing, and holograms are not standard bot components.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 3],
    selectCount: 3
  },
  {
    id: 136,
    question: "What is reinforcement learning?",
    options: [
      "Learning by memorizing all possible scenarios",
      "Learning through trial and error with rewards and penalties",
      "Learning only from labeled data",
      "Strengthening existing knowledge without new learning"
    ],
    correctAnswer: 1,
    explanation: "Reinforcement learning involves an agent learning optimal behavior through trial and error in an environment, receiving rewards for good actions and penalties for bad ones. Used in game AI, robotics, autonomous systems, and optimization problems where the best action isn't known in advance.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 137,
    question: "What is the purpose of Azure Video Analyzer?",
    options: [
      "To edit and produce videos",
      "To extract insights from video content using AI",
      "To stream videos only",
      "To compress video files"
    ],
    correctAnswer: 1,
    explanation: "Azure Video Analyzer (part of Azure AI Vision) extracts insights from video content including object detection, activity recognition, people tracking, facial recognition, scene detection, and OCR on video. Enables searchable, analyzable video archives and real-time video intelligence.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 138,
    question: "How does Azure OpenAI Service differ from standard Azure AI services?",
    options: [
      "They are identical",
      "OpenAI Service provides access to advanced generative models like GPT for diverse language tasks",
      "OpenAI Service only does translation",
      "Standard services are more powerful"
    ],
    correctAnswer: 1,
    explanation: "Azure OpenAI Service provides access to powerful generative AI models (GPT-4, GPT-3.5, DALL-E, etc.) for diverse tasks: content generation, summarization, code assistance, creative writing, and more. Combines OpenAI's models with Azure's enterprise security, compliance, and regional availability.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 139,
    question: "What is ensemble learning in machine learning?",
    options: [
      "Teaching machines to play music together",
      "Combining predictions from multiple models to improve accuracy",
      "Training one very large model",
      "Learning in a group classroom setting"
    ],
    correctAnswer: 1,
    explanation: "Ensemble learning combines predictions from multiple models to achieve better performance than any single model. Methods include bagging (random forest), boosting (gradient boosting), and stacking. Often used in winning ML competition solutions and production systems.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 140,
    question: "What is the purpose of named entity recognition (NER)?",
    options: [
      "To create names for entities",
      "To identify and classify entities like people, places, organizations, dates in text",
      "To name machine learning models",
      "To recognize celebrity names only"
    ],
    correctAnswer: 1,
    explanation: "Named Entity Recognition (NER) identifies and classifies named entities in text such as people, organizations, locations, dates, monetary values, percentages, and custom entity types. Essential for information extraction, document understanding, and content analysis.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 141,
    question: "What are the primary types of machine learning? (Select THREE)",
    options: [
      "Supervised learning",
      "Invisible learning",
      "Unsupervised learning",
      "Reverse learning",
      "Reinforcement learning",
      "Backward learning"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "The three primary machine learning types are: supervised learning (labeled data, known outcomes), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through rewards/penalties). Invisible, reverse, and backward learning are not ML paradigms.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 142,
    question: "What capabilities does Azure AI Document Intelligence provide? (Select THREE)",
    options: [
      "Document structure analysis",
      "Physical document shredding",
      "Key-value pair extraction",
      "Paper manufacturing",
      "Table and form data extraction",
      "Printer maintenance"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Azure AI Document Intelligence (formerly Form Recognizer) provides: document structure analysis, key-value pair extraction from forms, and table data extraction. Also handles receipts, invoices, ID cards, and custom documents. Not involved in physical document handling, manufacturing, or hardware maintenance.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 143,
    question: "Which are valid evaluation metrics for classification models? (Select THREE)",
    options: [
      "Accuracy",
      "Temperature",
      "Precision and recall",
      "Distance",
      "F1 score",
      "Volume"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Classification metrics include: accuracy (overall correctness), precision and recall (positive prediction quality and completeness), and F1 score (harmonic mean of precision and recall). Temperature, distance, and volume are not classification metrics.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 144,
    question: "What services support conversational AI deployment? (Select TWO)",
    options: [
      "Azure Bot Service",
      "Azure Firewall",
      "Azure Bot Framework SDK",
      "Azure Traffic Manager",
      "Azure VPN Gateway"
    ],
    correctAnswer: [0, 2],
    explanation: "Conversational AI deployment uses: Azure Bot Service for hosting and management, and Bot Framework SDK for development and channel integration. Firewall, Traffic Manager, and VPN are networking services, not bot-specific though they may support bot infrastructure.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 145,
    question: "What are benefits of using Azure AI Content Safety? (Select TWO)",
    options: [
      "Detecting harmful content in text and images",
      "Physical content security",
      "Moderating user-generated content",
      "Guarding buildings",
      "Shredding documents"
    ],
    correctAnswer: [0, 2],
    explanation: "Azure AI Content Safety provides: detection of harmful, offensive, or inappropriate content in text and images, and moderation capabilities for user-generated content. Helps ensure safe online communities and compliant content. Not related to physical security or document destruction.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 146,
    question: "What is the recommended approach when an AI model shows bias?",
    options: [
      "Ignore the bias and deploy anyway",
      "Analyze training data, rebalance datasets, and test across diverse scenarios",
      "Blame the algorithm only",
      "Accept bias as unavoidable"
    ],
    correctAnswer: 1,
    explanation: "Address bias by examining training data for representation issues, rebalancing datasets to include diverse examples, testing model performance across different groups, using fairness metrics, adjusting thresholds, and potentially retraining. Bias often stems from data, not just algorithms.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 147,
    question: "What is the purpose of A/B testing in AI deployments?",
    options: [
      "Testing two different algorithms",
      "Comparing model performance between two user groups to measure impact",
      "Alphabetical ordering of features",
      "Binary classification only"
    ],
    correctAnswer: 1,
    explanation: "A/B testing deploys different model versions to different user groups to compare performance, user satisfaction, and business metrics. Helps validate improvements before full rollout, measure actual impact, and make data-driven deployment decisions.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 148,
    question: "How does Azure Personalizer work?",
    options: [
      "It creates personal websites",
      "It uses reinforcement learning to optimize content recommendations for each user",
      "It personalizes Azure portal only",
      "It customizes user profile pages"
    ],
    correctAnswer: 1,
    explanation: "Azure Personalizer uses reinforcement learning to optimize content, product, and experience recommendations for individual users. Learns from user interactions (rewards) to continuously improve recommendations, maximizing engagement and satisfaction through personalization.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 149,
    question: "What is the relationship between AI, machine learning, and deep learning?",
    options: [
      "They are completely unrelated",
      "AI is broadest; ML is subset of AI; deep learning is subset of ML",
      "Deep learning includes AI and ML",
      "They are exactly the same"
    ],
    correctAnswer: 1,
    explanation: "AI is the broadest concept (machines performing intelligent tasks). Machine learning is a subset of AI (learning from data without explicit programming). Deep learning is a subset of ML (using neural networks with multiple layers). Each level is more specific than the previous.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 150,
    question: "What are the key principles of the Microsoft Responsible AI Standard? (Select THREE)",
    options: [
      "Fairness and reliability",
      "Maximum profit at any cost",
      "Privacy and security",
      "Avoiding transparency",
      "Inclusiveness and accountability",
      "Ignoring societal impact"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Microsoft's Responsible AI principles include: fairness and reliability (consistent, equitable performance), privacy and security (protecting data and users), and inclusiveness and accountability (accessible to all, clear responsibility). Also includes transparency. Profit maximization and opacity contradict responsible AI.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 151,
    question: "What is the purpose of model versioning in Azure Machine Learning?",
    options: [
      "To confuse users with multiple versions",
      "To track, compare, and roll back to previous model versions",
      "To increase storage costs",
      "Versioning is not supported"
    ],
    correctAnswer: 1,
    explanation: "Model versioning in Azure ML enables tracking different iterations, comparing performance across versions, rolling back to previous versions if needed, maintaining audit trails, and managing model lifecycle systematically. Essential for production ML operations and reproducibility.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 152,
    question: "How does Azure Cognitive Services handle API keys and security?",
    options: [
      "Keys are not needed",
      "Keys authenticate requests and should be managed securely with Key Vault and rotation",
      "Keys are publicly shared",
      "Security is not important for APIs"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Services use API keys for authentication. Best practices include: storing keys securely in Azure Key Vault, rotating keys regularly, using Azure AD authentication when possible, implementing network restrictions, and monitoring for unauthorized access.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 153,
    question: "What is image captioning in computer vision?",
    options: [
      "Adding text captions manually to images",
      "Automatically generating textual descriptions of image content",
      "Translating image metadata",
      "Removing text from images"
    ],
    correctAnswer: 1,
    explanation: "Image captioning uses AI to automatically generate natural language descriptions of image content. Analyzes objects, activities, context, and relationships to create meaningful captions. Useful for accessibility, content organization, and image search.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 154,
    question: "What is the purpose of hyperparameter tuning in machine learning?",
    options: [
      "To make models more complex",
      "To optimize model configuration parameters for better performance",
      "To increase training time",
      "To reduce dataset size"
    ],
    correctAnswer: 1,
    explanation: "Hyperparameter tuning optimizes configuration settings that control the learning process (learning rate, batch size, layers, etc.). Azure ML supports automated hyperparameter tuning using methods like random search, grid search, and Bayesian optimization to find optimal configurations.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 155,
    question: "How does Azure Translator handle custom terminology?",
    options: [
      "It cannot learn custom terms",
      "Custom Translator allows training on domain-specific translations and terminology",
      "Only Microsoft can add new terms",
      "Custom terms require new Azure subscriptions"
    ],
    correctAnswer: 1,
    explanation: "Custom Translator enables training translation models with your organization's domain-specific terminology, style, and context. Upload parallel documents (source and target language pairs) to improve translation accuracy for specialized content, industry jargon, or brand-specific terms.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 156,
    question: "What is the difference between image classification and object detection?",
    options: [
      "They are identical tasks",
      "Classification labels entire image; detection identifies and locates multiple objects within image",
      "Classification is always more accurate",
      "Detection only works with one object"
    ],
    correctAnswer: 1,
    explanation: "Image classification assigns one or more labels to an entire image (e.g., 'beach scene'). Object detection identifies multiple objects within an image, classifies each, and provides bounding boxes showing their locations. Detection is more complex and informative.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 157,
    question: "What is the purpose of the Azure Machine Learning designer?",
    options: [
      "To design Azure portal layouts",
      "To build ML pipelines visually with drag-and-drop interface",
      "To create user interfaces only",
      "To design logos"
    ],
    correctAnswer: 1,
    explanation: "Azure ML designer is a visual, drag-and-drop tool for building machine learning pipelines without writing code. Connect data preparation, training, and deployment steps visually. Makes ML accessible to users without programming expertise while still being powerful.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 158,
    question: "How does sentiment analysis handle mixed emotions in text?",
    options: [
      "It only detects one emotion",
      "Advanced models can detect multiple sentiments and provide confidence scores for each",
      "Mixed emotions cannot be analyzed",
      "It averages all emotions to neutral"
    ],
    correctAnswer: 1,
    explanation: "Modern sentiment analysis can detect mixed sentiments in text, providing confidence scores for positive, negative, and neutral sentiments. Some services also detect specific emotions (joy, anger, sadness, etc.) and handle nuanced expressions where multiple sentiments coexist.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 159,
    question: "What is the purpose of MLOps (Machine Learning Operations)?",
    options: [
      "To make ML more difficult",
      "To apply DevOps principles to ML lifecycle for automation, monitoring, and governance",
      "To eliminate data scientists",
      "To slow down model deployment"
    ],
    correctAnswer: 1,
    explanation: "MLOps applies DevOps practices to machine learning: automating model training and deployment, monitoring model performance, managing versions, ensuring reproducibility, implementing CI/CD for ML, and maintaining governance. Enables reliable, scalable ML in production.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 160,
    question: "What is optical character recognition (OCR) boundary detection?",
    options: [
      "Detecting physical boundaries of paper",
      "Identifying and locating text regions and individual characters in images",
      "Finding image borders only",
      "Measuring document dimensions"
    ],
    correctAnswer: 1,
    explanation: "OCR boundary detection identifies the location of text regions, lines, words, and individual characters in images, providing bounding box coordinates. This enables precise extraction of text from specific areas, handling complex layouts, and maintaining spatial relationships.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 161,
    question: "How does Azure handle multi-region deployment of AI models?",
    options: [
      "Multi-region is not supported",
      "Models can be deployed to multiple regions for low latency and high availability",
      "Only one region per subscription",
      "All regions share one model instance"
    ],
    correctAnswer: 1,
    explanation: "Azure supports deploying AI models to multiple regions for reduced latency (users connect to nearest region), high availability (failover capability), compliance (data residency requirements), and scalability. Use Traffic Manager or Front Door to route requests appropriately.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 162,
    question: "What is the purpose of text analytics for health in Azure?",
    options: [
      "To diagnose diseases automatically",
      "To extract medical entities, relationships, and insights from clinical text",
      "To replace doctors",
      "To manage hospital billing only"
    ],
    correctAnswer: 1,
    explanation: "Text Analytics for Health extracts and labels medical entities (conditions, medications, treatments, dosages), identifies relationships between entities, and detects clinical insights from unstructured medical text. Supports healthcare documentation, research, and clinical decision support (with appropriate human oversight).",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 163,
    question: "What is the role of ground truth data in machine learning?",
    options: [
      "Data collected from the ground only",
      "Verified, accurate labeled data used for training and evaluating models",
      "Unverified guesses",
      "Random data points"
    ],
    correctAnswer: 1,
    explanation: "Ground truth data is verified, accurately labeled data that represents the correct answers. Essential for supervised learning (training) and model evaluation (measuring accuracy). Quality of ground truth directly impacts model performance and reliability.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation"
  },
  {
    id: 164,
    question: "How does Azure AI handle compliance with data residency requirements?",
    options: [
      "Data can be stored anywhere",
      "Azure offers regional deployments to keep data and processing within specific geographic boundaries",
      "Compliance is not supported",
      "All data must go to US data centers"
    ],
    correctAnswer: 1,
    explanation: "Azure AI services can be deployed in specific regions to meet data residency requirements. Data stays within chosen geographic boundaries, helping organizations comply with GDPR, local regulations, and industry standards. Region selection is key for compliance.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 165,
    question: "What is domain adaptation in NLP?",
    options: [
      "Changing internet domains",
      "Adapting general language models to perform better on specific domains or industries",
      "Creating new programming domains",
      "Translating domain names"
    ],
    correctAnswer: 1,
    explanation: "Domain adaptation fine-tunes general language models with domain-specific data (medical, legal, financial, etc.) to improve performance on specialized content. Uses transfer learning to leverage general knowledge while adapting to domain-specific vocabulary, context, and patterns.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 166,
    question: "What is the purpose of model explainability in production?",
    options: [
      "To make models run slower",
      "To provide transparency about why models make specific predictions for trust and debugging",
      "To hide model logic",
      "Explainability has no production value"
    ],
    correctAnswer: 1,
    explanation: "Model explainability in production helps understand prediction reasoning, debug unexpected outputs, build user trust, meet regulatory requirements (right to explanation), identify bias, and ensure model behavior aligns with business logic. Essential for responsible AI deployment.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 167,
    question: "How does Azure Computer Vision analyze brand detection?",
    options: [
      "It only detects Microsoft brands",
      "It identifies commercial brands and logos in images from a database of thousands of brands",
      "Brand detection is not available",
      "It requires manual brand registration"
    ],
    correctAnswer: 1,
    explanation: "Azure Computer Vision's brand detection identifies thousands of commercial brands and logos in images and video. Useful for social media monitoring, brand placement analysis, content moderation, and marketing insights. Continuously updated with new brands.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 168,
    question: "What is active learning in machine learning?",
    options: [
      "Learning while exercising",
      "Iteratively selecting most informative examples for labeling to improve model efficiently",
      "Learning only during business hours",
      "Aggressive learning algorithms"
    ],
    correctAnswer: 1,
    explanation: "Active learning intelligently selects the most informative unlabeled examples for human labeling, maximizing model improvement per labeled example. Reduces labeling costs and time by focusing on examples where the model is most uncertain or would learn most.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 169,
    question: "What is the purpose of Azure Metrics Advisor?",
    options: [
      "To provide fitness advice",
      "To monitor data metrics, detect anomalies, and diagnose issues in time-series data",
      "To measure physical distances",
      "To count website visitors only"
    ],
    correctAnswer: 1,
    explanation: "Azure Metrics Advisor uses AI to monitor business metrics, detect anomalies in time-series data, diagnose root causes, and send alerts. Helps identify business issues like revenue drops, quality problems, or system failures by analyzing patterns across multiple metrics.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 170,
    question: "How does conversational language understanding differ from QnA Maker?",
    options: [
      "They are identical services",
      "CLU handles complex intents and entities; QnA focuses on question-answer pairs from knowledge bases",
      "QnA is more advanced",
      "CLU only works in English"
    ],
    correctAnswer: 1,
    explanation: "Conversational Language Understanding (CLU) handles complex intent recognition and entity extraction for conversational scenarios. QnA Maker/Question Answering focuses on matching questions to answers from knowledge bases (FAQs, documents). Often used together in comprehensive bot solutions.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 171,
    question: "What is the purpose of batch inference in ML?",
    options: [
      "To make predictions slower",
      "To efficiently process large volumes of data for predictions on a schedule",
      "To limit model usage",
      "Batch processing is obsolete"
    ],
    correctAnswer: 1,
    explanation: "Batch inference processes large volumes of data for predictions on a schedule rather than real-time. More cost-effective for non-urgent predictions, can leverage cheaper compute resources, optimizes throughput over latency. Used for reporting, analytics, and offline scoring.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 172,
    question: "How does Azure AI handle different languages in speech recognition?",
    options: [
      "Only English is supported",
      "Supports multiple languages with language identification and language-specific models",
      "All languages use the same model",
      "Maximum of 5 languages supported"
    ],
    correctAnswer: 1,
    explanation: "Azure Speech service supports dozens of languages with language-specific models optimized for each. Includes automatic language identification, multi-language recognition, and language switching. Coverage varies by language for features like custom models and neural voices.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 173,
    question: "What is model drift monitoring?",
    options: [
      "Monitoring physical model movement",
      "Tracking changes in model performance over time as data patterns change",
      "Monitoring model training duration",
      "Checking model file sizes"
    ],
    correctAnswer: 1,
    explanation: "Model drift monitoring detects when model performance degrades due to changes in data patterns over time (data drift) or differences between training and production data. Triggers retraining when performance drops below thresholds. Essential for maintaining model accuracy in production.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 174,
    question: "What is spatial analysis in Azure Computer Vision?",
    options: [
      "Analyzing outer space images",
      "Understanding people movement, occupancy, and spatial relationships in physical spaces from video",
      "Measuring image dimensions only",
      "Analyzing storage space"
    ],
    correctAnswer: 1,
    explanation: "Spatial analysis in Azure Computer Vision analyzes video to understand people's movement patterns, count occupancy, detect social distancing, measure dwell times, and track paths through physical spaces. Used for retail analytics, safety compliance, and facility optimization.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 175,
    question: "What are cognitive skills in Azure Cognitive Search?",
    options: [
      "Employee training programs",
      "AI capabilities that enrich content during indexing with extraction, analysis, and transformation",
      "Database queries only",
      "Hardware specifications"
    ],
    correctAnswer: 1,
    explanation: "Cognitive skills are AI-powered capabilities in Azure Cognitive Search that enrich content during indexing: OCR, entity recognition, language detection, key phrase extraction, sentiment analysis, image analysis, and custom skills. Create AI-enrichment pipelines for searchable insights.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 176,
    question: "How does Azure handle model performance monitoring in production?",
    options: [
      "Monitoring is not available",
      "Application Insights and ML monitoring track performance, latency, errors, and drift",
      "Only manual monitoring is supported",
      "Monitoring stops after deployment"
    ],
    correctAnswer: 1,
    explanation: "Azure provides comprehensive monitoring through Application Insights, Azure Monitor, and ML-specific monitoring for deployed models. Track prediction latency, throughput, errors, data drift, model drift, and resource utilization. Set alerts and automate responses to issues.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 177,
    question: "What is the purpose of conversation context in chatbots?",
    options: [
      "To forget previous messages",
      "To maintain conversation history and provide coherent, context-aware responses",
      "Context is not needed in bots",
      "To store only the last message"
    ],
    correctAnswer: 1,
    explanation: "Conversation context maintains history of the dialogue, enabling bots to provide coherent responses that reference previous statements, handle follow-up questions, maintain topic continuity, and deliver personalized experiences. Essential for natural conversations.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Foundation"
  },
  {
    id: 178,
    question: "What is zero-shot learning in NLP?",
    options: [
      "Learning nothing",
      "Making predictions on categories not seen during training by understanding descriptions",
      "Training without any data",
      "Shooting accuracy in gaming"
    ],
    correctAnswer: 1,
    explanation: "Zero-shot learning enables models to handle tasks or categories they weren't explicitly trained on by understanding natural language descriptions or leveraging related knowledge. Large language models excel at zero-shot tasks, making them versatile without task-specific training.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 179,
    question: "What Azure services support real-time inference? (Select THREE)",
    options: [
      "Azure Kubernetes Service (AKS)",
      "Azure Archive Storage",
      "Azure Container Instances (ACI)",
      "Azure Backup",
      "Azure Machine Learning managed endpoints",
      "Azure DNS"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Real-time inference deployment options include: AKS for scalable production deployments, ACI for dev/test or low-scale scenarios, and Azure ML managed endpoints for simplified deployment with automatic scaling. Archive Storage, Backup, and DNS support infrastructure but not model hosting.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 180,
    question: "Which factors affect computer vision model accuracy? (Select THREE)",
    options: [
      "Image quality and resolution",
      "Weather conditions",
      "Training dataset diversity",
      "Time of day",
      "Model architecture and size",
      "Room temperature"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Computer vision accuracy depends on: image quality and resolution (clearer images = better results), training dataset diversity (varied examples improve generalization), and model architecture/size (capacity to learn patterns). Weather, time, and temperature during inference don't directly affect model accuracy.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 181,
    question: "What are common NLP preprocessing steps? (Select THREE)",
    options: [
      "Tokenization",
      "Image resizing",
      "Removing stop words",
      "Object detection",
      "Lemmatization or stemming",
      "Facial recognition"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "NLP preprocessing includes: tokenization (splitting text into words/tokens), removing stop words (common words like 'the', 'is'), and lemmatization/stemming (reducing words to base forms). Image resizing, object detection, and facial recognition are computer vision tasks.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 182,
    question: "Which are benefits of Azure ML managed endpoints? (Select TWO)",
    options: [
      "Automatic scaling based on traffic",
      "Requires manual infrastructure management",
      "Built-in monitoring and logging",
      "No authentication options",
      "Unlimited free tier"
    ],
    correctAnswer: [0, 2],
    explanation: "Azure ML managed endpoints provide: automatic scaling to handle traffic variations, and built-in monitoring/logging for performance insights. They simplify infrastructure management (not manual), include robust authentication options, and use pay-as-you-go pricing (not unlimited free).",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 183,
    question: "What capabilities does Azure Immersive Reader provide? (Select TWO)",
    options: [
      "Text-to-speech for reading content aloud",
      "Video game creation",
      "Translation and reading comprehension tools",
      "3D modeling",
      "Cryptocurrency mining"
    ],
    correctAnswer: [0, 2],
    explanation: "Azure Immersive Reader provides: text-to-speech to read content aloud, and translation with reading comprehension features (syllabification, grammar tools, picture dictionary). Designed to improve reading accessibility and comprehension. Not related to gaming, 3D modeling, or cryptocurrency.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 184,
    question: "Which are valid bot deployment channels? (Select THREE)",
    options: [
      "Microsoft Teams",
      "Telegraph",
      "Web chat",
      "Morse code",
      "SMS/text messaging",
      "Smoke signals"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Azure Bot Service supports deployment to: Microsoft Teams, web chat (embeddable widget), and SMS/text messaging. Also supports Slack, Facebook Messenger, email, and more. Telegraph, Morse code, and smoke signals are not digital bot channels.",
    domain: "Describe features of conversational AI workloads on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 185,
    question: "What are characteristics of deep learning models? (Select TWO)",
    options: [
      "Use neural networks with multiple layers",
      "Always faster than traditional ML",
      "Require large amounts of training data",
      "Never need GPUs",
      "Always less accurate"
    ],
    correctAnswer: [0, 2],
    explanation: "Deep learning models use neural networks with multiple hidden layers and typically require large training datasets to learn complex patterns. They often need GPUs for efficient training (not 'never'), may be slower to train than traditional ML, and can achieve higher accuracy for complex tasks.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 186,
    question: "Which Azure services help with document processing? (Select THREE)",
    options: [
      "Azure AI Document Intelligence (Form Recognizer)",
      "Azure Load Balancer",
      "Azure Computer Vision (OCR)",
      "Azure Traffic Manager",
      "Azure Cognitive Search",
      "Azure Firewall"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Document processing uses: Document Intelligence for form/document structure extraction, Computer Vision for OCR and text recognition, and Cognitive Search for indexing and searching document content. Load Balancer, Traffic Manager, and Firewall are networking services.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 187,
    question: "What are considerations for ethical AI deployment? (Select THREE)",
    options: [
      "Bias detection and mitigation",
      "Maximizing profit only",
      "Transparency about AI usage",
      "Hiding all AI decisions",
      "User privacy protection",
      "Ignoring societal impact"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Ethical AI deployment requires: detecting and mitigating bias, being transparent about AI usage and limitations, and protecting user privacy. Pure profit focus, hiding decisions, and ignoring societal impact contradict ethical AI principles.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  },
  {
    id: 188,
    question: "Which metrics are relevant for regression models? (Select TWO)",
    options: [
      "Mean Absolute Error (MAE)",
      "Accuracy percentage",
      "Root Mean Squared Error (RMSE)",
      "Precision and recall",
      "F1 score"
    ],
    correctAnswer: [0, 2],
    explanation: "Regression metrics include: MAE (average absolute prediction error) and RMSE (square root of mean squared errors, penalizes large errors more). Accuracy, precision, recall, and F1 are classification metrics, not suitable for continuous value predictions.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 189,
    question: "What is the purpose of Azure Content Moderator?",
    options: [
      "To moderate Azure portal content",
      "To detect and filter potentially offensive, risky, or unwanted content in text, images, and videos",
      "To moderate meeting attendees",
      "To moderate CPU usage"
    ],
    correctAnswer: 1,
    explanation: "Azure Content Moderator detects potentially offensive, inappropriate, or risky content in text, images, and videos. Helps enforce community standards, comply with regulations, and create safe online environments. Includes human review workflows for complex decisions.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 190,
    question: "What is prompt engineering in the context of large language models?",
    options: [
      "Building physical prompts",
      "Crafting effective inputs to guide LLM outputs toward desired results",
      "Engineering UI prompts only",
      "Prompt timing optimization"
    ],
    correctAnswer: 1,
    explanation: "Prompt engineering is the practice of crafting effective input prompts to guide large language models toward desired outputs. Involves providing context, examples (few-shot learning), clear instructions, and constraints to improve response quality, accuracy, and relevance.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 191,
    question: "How does Azure AI Vision handle adult content detection?",
    options: [
      "Adult content detection is not available",
      "Analyzes images for adult, racy, or gory content with confidence scores",
      "Only blocks all images",
      "Requires manual review of all images"
    ],
    correctAnswer: 1,
    explanation: "Azure AI Vision (Computer Vision) analyzes images for adult (explicit), racy (suggestive), or gory content, providing confidence scores for each category. Enables content filtering, compliance enforcement, and safe search implementations. Organizations set appropriate thresholds.",
    domain: "Describe features of computer vision workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 192,
    question: "What is the purpose of model ensembling in production?",
    options: [
      "To make predictions slower",
      "To combine multiple models for more accurate and robust predictions",
      "To use only one model",
      "To increase costs unnecessarily"
    ],
    correctAnswer: 1,
    explanation: "Model ensembling combines predictions from multiple models to achieve better accuracy and robustness than any single model. Reduces risk of poor performance on specific data patterns, provides more stable predictions, and can combine different model types for complementary strengths.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 193,
    question: "What is opinion mining in text analytics?",
    options: [
      "Mining for minerals",
      "Extracting aspect-based sentiment to identify opinions about specific features or attributes",
      "Collecting user demographics only",
      "Counting words"
    ],
    correctAnswer: 1,
    explanation: "Opinion mining (aspect-based sentiment) extracts sentiments about specific aspects of products or services (e.g., 'great camera' vs 'poor battery life'). Provides granular insights beyond overall sentiment, identifying what specifically users like or dislike.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied"
  },
  {
    id: 194,
    question: "How does Azure handle AI model costs?",
    options: [
      "All AI is completely free",
      "Pay-as-you-go based on API calls, compute usage, and data volume",
      "One fixed annual fee",
      "Costs are unpredictable"
    ],
    correctAnswer: 1,
    explanation: "Azure AI uses pay-as-you-go pricing based on factors like number of API transactions, compute resources consumed, data processed, and storage used. Offers free tiers for experimentation, predictable pricing, and cost management tools. Different services have different pricing models.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 195,
    question: "What is the relationship between training data quantity and model performance?",
    options: [
      "More data always makes models worse",
      "Generally more diverse, quality data improves performance, but with diminishing returns",
      "Data quantity has no effect",
      "Less data always produces better models"
    ],
    correctAnswer: 1,
    explanation: "Generally, more diverse, high-quality training data improves model performance, but with diminishing returns after a point. Data quality matters more than quantity. Too much poor-quality or redundant data can hurt performance. The optimal amount depends on model complexity and task difficulty.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 196,
    question: "What is the purpose of Azure Cognitive Services containers?",
    options: [
      "Physical storage containers",
      "To run AI services on-premises or in custom environments while maintaining Azure API compatibility",
      "To ship Azure hardware",
      "Database containers only"
    ],
    correctAnswer: 1,
    explanation: "Azure Cognitive Services containers enable running AI services (Computer Vision, Text Analytics, etc.) in your own infrastructure while maintaining API compatibility with Azure. Useful for data residency, latency requirements, disconnected scenarios, or hybrid deployments.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Applied"
  },
  {
    id: 197,
    question: "How does Azure AI support accessibility?",
    options: [
      "Accessibility is not a focus",
      "Provides services like speech-to-text, text-to-speech, OCR, and Immersive Reader for inclusive experiences",
      "Only for specific disabilities",
      "Accessibility requires custom development"
    ],
    correctAnswer: 1,
    explanation: "Azure AI strongly supports accessibility through speech services (enabling voice interfaces), OCR and text extraction (reading printed content), Immersive Reader (reading assistance), image descriptions, and closed captioning. Makes digital content accessible to people with diverse abilities.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation"
  },
  {
    id: 198,
    question: "What is curriculum learning in ML?",
    options: [
      "Teaching ML in schools only",
      "Training models with progressively harder examples, from simple to complex",
      "Using standard curriculum documents",
      "Learning about college courses"
    ],
    correctAnswer: 1,
    explanation: "Curriculum learning trains models by presenting examples in a meaningful order, starting with simpler cases and progressively introducing more complex patterns. Inspired by human learning, it can improve training efficiency, final performance, and learning stability for difficult tasks.",
    domain: "Describe fundamental principles of machine learning on Azure",
    difficulty: "Applied"
  },
  {
    id: 199,
    question: "What are text summarization approaches in Azure? (Select TWO)",
    options: [
      "Extractive summarization",
      "Explosive summarization",
      "Abstractive summarization",
      "Destructive summarization",
      "Reactive summarization"
    ],
    correctAnswer: [0, 2],
    explanation: "Azure supports extractive summarization (selecting key sentences from original text) and abstractive summarization (generating new text that captures meaning). Extractive guarantees accuracy of selected text; abstractive creates more natural, concise summaries. Explosive, destructive, and reactive are not summarization methods.",
    domain: "Describe features of Natural Language Processing (NLP) workloads on Azure",
    difficulty: "Applied",
    questionType: "multiple",
    correctAnswers: [0, 2],
    selectCount: 2
  },
  {
    id: 200,
    question: "What are key trends in Azure AI development? (Select THREE)",
    options: [
      "Integration of large language models",
      "Decreasing model capabilities",
      "Responsible AI tooling and governance",
      "Removing all APIs",
      "Edge AI and hybrid deployments",
      "Eliminating cloud services"
    ],
    correctAnswer: [0, 2, 4],
    explanation: "Key Azure AI trends include: integration of powerful large language models (Azure OpenAI), enhanced responsible AI tools and governance features, and expanded edge/hybrid deployment options for flexibility. Capabilities are increasing, not decreasing, and APIs/cloud services remain central.",
    domain: "Describe Artificial Intelligence workloads and considerations",
    difficulty: "Foundation",
    questionType: "multiple",
    correctAnswers: [0, 2, 4],
    selectCount: 3
  }
];

export default AI900Questions;